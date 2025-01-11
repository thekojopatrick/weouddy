import React from 'react';

export const Container = ({
  childern,
}: {
  childern: React.ReactNode;
}) => {
  return (
    <div className="isolate flex max-w-[3840px] flex-col bg-primary">
      {childern}
    </div>
  );
};

export const ContainerPadding = ({
  childern,
}: {
  childern: React.ReactNode;
}) => {
  return (
    <div className="[--container-x-padding:20px] min-720:[--container-x-padding:24px] min-1280:[--container-x-padding:32px] min-1536:[--container-x-padding:80px]">
      {childern}
    </div>
  );
};
