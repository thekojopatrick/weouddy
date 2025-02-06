'use client';

import React, { useEffect, useRef, useState } from 'react';
import { EventPostCard } from '@/features/events/components/post/post-card';
import { PostWithDetails } from '@/types/prisma.types';

const MasonryPosts = ({
  posts,
  userId,
}: {
  posts: PostWithDetails[];
  userId: string;
}) => {
  const [columns, setColumns] = useState<PostWithDetails[][]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const getColumnHeight = (column: PostWithDetails[]): number => {
    return column.reduce((height) => height + 300, 0); // Approximate height calculation
  };

  useEffect(() => {
    const calculateLayout = () => {
      const container = containerRef.current;
      if (!container || !posts) return;

      const containerWidth = container.offsetWidth;
      const minColumnWidth = 300; // minimum width for each column
      const columnCount = Math.max(
        1,
        Math.floor(containerWidth / minColumnWidth)
      );

      // Initialize columns
      const newColumns: PostWithDetails[][] = Array.from(
        { length: columnCount },
        () => []
      );
      let shortestColumn = 0;

      // Distribute posts across columns
      posts.forEach((post) => {
        // Find shortest column
        shortestColumn = newColumns
          .map((col, index) => ({
            height: getColumnHeight(col),
            index,
          }))
          .reduce(
            (min, col) => (col.height < min.height ? col : min),
            {
              height: Infinity,
              index: 0,
            }
          ).index;

        newColumns[shortestColumn].push(post);
      });

      setColumns(newColumns);
    };

    calculateLayout();
    window.addEventListener('resize', calculateLayout);
    return () =>
      window.removeEventListener('resize', calculateLayout);
  }, [posts]);

  return (
    <div ref={containerRef} className="w-full">
      <div className="flex gap-4">
        {columns.map((column, columnIndex) => (
          <div
            key={columnIndex}
            className="flex-1 flex flex-col gap-4"
          >
            {column?.map((post: PostWithDetails) => (
              <EventPostCard
                key={post.id}
                post={post as never}
                userId={userId}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MasonryPosts;
