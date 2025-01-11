import React from 'react';

export const Container = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="isolate flex px-5 max-w-[3840px] flex-col md:px-6 xl:[--container-x-padding:32px] 2xl:[--container-x-padding:80px]">
      {children}
    </div>
  );
};
