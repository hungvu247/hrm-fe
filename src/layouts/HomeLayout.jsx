import React from "react";
import HighlightedContent from "./HighlightedContent";
import ViewAllJobPostingsByPostingDate from "./ViewAllJobPostingsByPostingDate";
import { Divider, Icon } from "semantic-ui-react";

export default function HomeLayout() {
  return (
    <div>
      <HighlightedContent />

      <Divider horizontal>
        <Icon name="bell outline" /> Recently Posted
      </Divider>
      <br />
      <br />

      <ViewAllJobPostingsByPostingDate />
    </div>
  );
}
