const { useState } = require("react");

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1);
}
export default useForceUpdate;
