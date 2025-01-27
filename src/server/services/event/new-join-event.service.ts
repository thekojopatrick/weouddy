import { db } from '@/server/db/prisma';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

export class JoinEventError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = 'JoinEventError';
    this.code = code;
  }
}

export class JoinEventService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  private validateJoinRequest(data: {
    identifier: string;
    userId: string;
    pin?: string;
  }) {
    const schema = z.object({
      identifier: z.string().min(1, 'Event identifier is required'),
      userId: z.string().min(1, 'User ID is required'),
      pin: z.string().optional(),
    });

    return schema.parse(data);
  }

  // async joinEvent({
  //   identifier,
  //   userId,
  //   pin,
  // }: {
  //   identifier: string;
  //   userId: string;
  //   pin?: string;
  // }) {
  //   const startTime = Date.now();
  //   this.validateJoinRequest({
  //     identifier,
  //     userId,
  //     pin,
  //   });

  //   const event = await this.prisma.event.findFirst({
  //     where: {
  //       OR: [{ id: identifier }, { slug: identifier }],
  //     },
  //     select: {
  //       id: true,
  //       slug: true,
  //       accessType: true,
  //       hostId: true,
  //       requiresApproval: true,
  //       pinCode: true,
  //       isDisabled: true,
  //       _count: { select: { attendees: true } },
  //     },
  //   });

  //   if (!event) {
  //     throw new JoinEventError('Event not found', 'EVENT_NOT_FOUND');
  //   }

  //   // Access type validation
  //   switch (event.accessType) {
  //     case 'PIN_REQUIRED':
  //       if (!pin) {
  //         throw new JoinEventError('PIN is required', 'PIN_REQUIRED');
  //       }
  //       // PIN validation logic
  //       if (pin !== 'correct-pin') {
  //         throw new JoinEventError('Invalid PIN', 'INVALID_PIN');
  //       }
  //       break;
  //     case 'INVITE_ONLY':
  //       throw new JoinEventError(
  //         'Event is invite-only',
  //         'INVITE_ONLY'
  //       );
  //   }

  //   // Check existing attendance
  //   const existingAttendee = await this.prisma.attendee.findUnique({
  //     where: {
  //       userId_eventId: {
  //         userId: userId,
  //         eventId: event.id,
  //       },
  //     },
  //     select: {
  //       id: true,
  //       status: true,
  //     },
  //   });

  //   // if (existingAttendee) {
  //   //   throw new JoinEventError(
  //   //     'Already part of this event',
  //   //     'ALREADY_JOINED'
  //   //   );
  //   // }

  //   // Determine status
  //   const status =
  //     event.hostId === userId || !event.requiresApproval
  //       ? 'APPROVED'
  //       : 'PENDING';

  //   try {
  //     await db.$transaction(async (tx) => {
  //       if (existingAttendee) {
  //         // Update if status changed
  //         if (existingAttendee.status !== status) {
  //           return tx.attendee.update({
  //             where: { id: existingAttendee.id },
  //             data: { status },
  //             select: { status: true },
  //           });
  //         }
  //         return { status: existingAttendee.status };
  //       }

  //       if (status === 'APPROVED') {
  //         await tx.event.update({
  //           where: { id: event.id },
  //           data: {
  //             members: { connect: { id: userId } },
  //           },
  //         });
  //       } else {
  //         await tx.eventActivity.create({
  //           data: {
  //             eventId: event.id,
  //             userId,
  //             type: 'JOIN',
  //           },
  //         });
  //       }

  //       // Create attendee
  //       await tx.attendee.create({
  //         data: {
  //           eventId: event.id,
  //           userId: userId,
  //         },
  //       });
  //     });
  //   } catch (err) {
  //     // Handle the rollback...
  //     console.error(err);
  //   }

  //   const executionTime = Date.now() - startTime;
  //   console.log(`Join event execution time: ${executionTime}ms`);

  //   return {
  //     success: true,
  //     status: 'JOINED',
  //     event: {
  //       id: event.id,
  //       slug: event.slug,
  //       accessType: event.accessType,
  //     },
  //   };
  // }

  async joinEvent({
    identifier,
    userId,
    pin,
  }: {
    identifier: string;
    userId: string;
    pin?: string;
  }) {
    this.validateJoinRequest({
      identifier,
      userId,
      pin,
    });

    const event = await this.prisma.event.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
      select: {
        id: true,
        slug: true,
        accessType: true,
        hostId: true,
        requiresApproval: true,
        pinCode: true,
        isDisabled: true,
        _count: { select: { attendees: true } },
      },
    });

    if (!event) {
      throw new JoinEventError('Event not found', 'EVENT_NOT_FOUND');
    }

    // Access type validation
    switch (event.accessType) {
      case 'PIN_REQUIRED':
        if (!pin) {
          throw new JoinEventError('PIN is required', 'PIN_REQUIRED');
        }
        if (pin !== event.pinCode) {
          throw new JoinEventError('Invalid PIN', 'INVALID_PIN');
        }
        break;
      case 'INVITE_ONLY':
        throw new JoinEventError(
          'Event is invite-only',
          'INVITE_ONLY'
        );
    }

    // Determine status
    const status =
      event.hostId === userId || !event.requiresApproval
        ? 'APPROVED'
        : 'PENDING';

    try {
      return await db.$transaction(async (tx) => {
        // Upsert instead of create to handle existing records
        await tx.attendee.upsert({
          where: {
            userId_eventId: {
              userId: userId,
              eventId: event.id,
            },
          },
          update: { status },
          create: {
            eventId: event.id,
            userId: userId,
            status,
          },
        });

        if (status === 'APPROVED') {
          await tx.event.update({
            where: { id: event.id },
            data: {
              members: { connect: { id: userId } },
            },
          });
        } else {
          await tx.eventActivity.create({
            data: {
              eventId: event.id,
              userId,
              type: 'JOIN',
            },
          });
        }

        return {
          success: true,
          status: 'JOINED',
          event: {
            id: event.id,
            slug: event.slug,
            accessType: event.accessType,
          },
        };
      });
    } catch (err) {
      console.error(err);
      throw new JoinEventError('Failed to join event', 'JOIN_FAILED');
    }
  }

  async checkAttendeeStatus(eventId: string, userId: string) {
    const result = this.prisma.attendee.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
      select: {
        id: true,
        status: true,
        event: { select: { id: true, name: true, slug: true } },
      },
    });

    const data = await result;

    if (data?.status === 'APPROVED' || data?.status === 'JOINED') {
      return {
        ...data,
        status: 'JOINED',
      };
    } else if (
      data?.status === 'PENDING' ||
      data?.status === 'DENIED'
    ) {
      return data;
    }

    return {
      id: eventId,
      status: 'NOT_JOINED',
    };
  }
}

export const joinEventService = new JoinEventService(
  new PrismaClient()
);
