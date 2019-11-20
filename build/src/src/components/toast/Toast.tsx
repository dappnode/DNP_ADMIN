import React from "react";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import "./toastStyle.css";
// External
import { activityPath } from "pages/support/data";

const errorElement = (message: string) => (
  <div>
    {message}
    <NavLink to={activityPath}>
      <button className="btn btn-danger ml-2 mr-2" type="button">
        Show details
      </button>
    </NavLink>
  </div>
);

const pendingElement = (message: string) => (
  <div>
    <div style={{ minHeight: "35px" }}>{message}</div>
    <div className="slider">
      <div className="line" />
      <div className="subline inc" />
      <div className="subline dec" />
    </div>
    <div className="slider-fade" />
  </div>
);

interface ToastProps {
  message: string;
  pending?: boolean;
  success?: boolean;
  hideDetailsButton?: boolean;
}

const Toast = ({
  message,
  pending,
  success,
  hideDetailsButton
}: ToastProps) => {
  const { SUCCESS, ERROR } = toast.TYPE;
  const position = toast.POSITION.BOTTOM_RIGHT;
  const autoClose = 5000;
  let id: number | null = null;

  if (pending) {
    id = toast(pendingElement(message), {
      position,
      autoClose: false
    });
  } else if (success) {
    toast(message, {
      position,
      autoClose,
      type: SUCCESS
    });
  } else {
    // set hideDetailsButton = true to NOT show the "details" button
    toast(hideDetailsButton ? message : errorElement(message), {
      position,
      autoClose,
      type: ERROR
    });
  }

  return {
    id,
    resolve: (res: { success: boolean; message: string }) => {
      // Prevent racing condition if the toast is resolved too fast
      const defaultMsg = "Broken response, missing res message";
      setTimeout(() => {
        if (!id) return;
        if (toast.isActive(id))
          if (res.success) {
            // Existing toast, update
            toast.update(id, {
              render: res.message || defaultMsg,
              autoClose,
              type: SUCCESS
            });
          } else {
            toast.update(id, {
              render: errorElement(res.message || defaultMsg),
              autoClose,
              type: ERROR
            });
          }
        else if (res.success)
          toast(res.message || defaultMsg, {
            position,
            autoClose,
            type: SUCCESS
          });
        else {
          toast.error(errorElement(res.message || defaultMsg), {
            position,
            autoClose,
            type: ERROR
          });
        }
      }, 10);
    }
  };
};

export default Toast;
