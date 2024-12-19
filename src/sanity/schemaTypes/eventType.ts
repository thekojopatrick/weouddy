import { defineField, defineType } from "sanity";

import { CalendarIcon } from "@sanity/icons";

export const eventType = defineType({
  name: "event",
  title: "Events",
  type: "document",
  icon: CalendarIcon as never,
  fields: [
    defineField(
      {
        name: "title",
        title: "Title",
        type: "string",
        validation: (Rule) => Rule.required(),
      },
    ),
    defineField(
      {
        name: "description",
        title: "Description",
        type: "text",
      },
    ),
    defineField({
      name: "date",
      title: "Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "time",
      title: "Time",
      type: "string",
      description: "eg 1:30 PM or 1:300 AM",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: "Event URL",
      name: "eventUrl",
      type: "url",
      description: "Paste event url here",
    }),
    defineField({
      name: "isPast",
      title: "Is Past Event",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
