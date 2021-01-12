import React, { FC, HTMLProps } from "react";
import { useParams } from "react-router-dom";

type TopicProps = HTMLProps<HTMLDivElement>;

const Topic: FC<TopicProps> = function () {
  const { topicId } = useParams<{ topicId: string }>();
  return <div>{topicId}</div>;
};

export default Topic;
