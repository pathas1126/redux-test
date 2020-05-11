import React, { Component } from "react";
import store from "../../common/store";
import { getNextTimeline } from "../../common/mockData";
import { addTimeline } from "../state";
import TimelineList from "../component/TimelineList";

class TimelineMain extends Component {
  componentDidMount() {
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
  }

  componentWillUnmout() {
    this.unsubscribe();
  }

  onAdd = () => {
    const timeline = getNextTimeline();
    store.dispatch(addTimeline(timeline));
  };

  render() {
    console.log("TimelineMain render");
    const timelines = store.getState().timeline.timelines;
    return (
      <div>
        <button onClick={this.onAdd}>타임라인 추가</button>
        <TimelineList timelines={timelines} />
      </div>
    );
  }
}

export default TimelineMain;
