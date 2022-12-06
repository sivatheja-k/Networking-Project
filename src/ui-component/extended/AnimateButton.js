import { forwardRef } from "react";
// third-party

// ==============================|| ANIMATION BUTTON ||============================== //

const AnimateButton = forwardRef(
  ({ children, type, direction, offset, scale }, ref) => {
    return <div ref={ref}>{children}</div>;
  }
);

export default AnimateButton;
