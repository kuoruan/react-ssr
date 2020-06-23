import React, { FC, HTMLProps } from "react";
import { useParams } from "react-router-dom";

interface TopicProps extends HTMLProps<HTMLDivElement> {}

const Topic: FC<TopicProps> = function (props: TopicProps) {
  let { topicId } = useParams();
  return <div>{topicId}</div>;
};

export default Topic;
