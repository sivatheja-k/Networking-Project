import toast from "react-hot-toast";

export const successToast = (value) => {
  toast.success(value, {
    duration: 4000,
  });
};

export const errorToast = (value) => {
  toast.error(value, {
    duration: 4000,
  });
};
