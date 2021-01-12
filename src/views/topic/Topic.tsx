import React, { FC, HTMLProps } from "react";
import { useParams } from "react-router-dom";

type TopicProps = HTMLProps<HTMLDivElement>;

const Topic: FC<TopicProps> = function (props: TopicProps) {
  const { topicId } = useParams<{ topicId: string }>();
  return <div {...props}>{topicId}</div>;
};

export default Topic;
