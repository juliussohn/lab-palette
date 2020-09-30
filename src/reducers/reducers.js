import update from "react-addons-update";
const getSwatch = () => {
  const hue = Math.floor(Math.random() * 360);
  return {
    hue: [hue, hue, hue],
    chroma: [100, 100, 100]
  };
};

const defaultState = {
  options: {
    steps: 5,
    lightness: [20, 100],
    showImaginary: true
  },
  swatches: [getSwatch()]
};

function reducers(state = defaultState, action) {
  console.log(action);
  switch (action.type) {
    case "ADD_SWATCH":
      return update(state, {
        swatches: { $push: [getSwatch()] }
      });

    case "SET_STEPS":
      return {
        ...state,
        options: {
          ...state.options,
          steps: action.steps
        }
      };

    case "UPDATE_SWATCH":
      return update(state, {
        swatches: {
          [action.index]: { $merge: action.swatch }
        }
      });

    case "SET_LIGHTNESS":
      return update(state, {
        options: {
          lightness: { $set: action.lightness }
        }
      });

    case "SET_IMAGINARY":
      return update(state, {
        options: {
          showImaginary: { $set: action.imaginary }
        }
      });
    default:
      return state;
  }
}

export default reducers;
