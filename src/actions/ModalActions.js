// Modal actions
export const openModal = () => ({
  type: "OPEN_MODAL",
  status: "opened"
});

export const closeModal = () => ({
  type: "CLOSE_MODAL",
  status: "closed"
});

export const feedModal = data => ({
  type: "FEED_MODAL",
  data: data
});

export const cleanModal = () => ({
  type: "CLEAN_MODAL",
  data: false
});

export function toggleModal(data) {
  // Redux Thunk will inject dispatch here:
  return (dispatch, getState) => {
    const modalStatus = getState().modals.status;

    if (modalStatus === "opened") {
      dispatch(closeModal());
      dispatch(cleanModal());
    } else {
      dispatch(openModal());
      dispatch(feedModal(data));
    }
  };
}
