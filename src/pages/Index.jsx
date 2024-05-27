import { useEffect, useState } from "react";
import { Container, Text, VStack, Box, Heading, Link, Spinner } from "@chakra-ui/react";

const Index = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://hacker-news.firebaseio.com/v0/topstories.json")
      .then((response) => response.json())
      .then((storyIds) => {
        const top10Ids = storyIds.slice(0, 10);
        return Promise.all(
          top10Ids.map((id) =>
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((response) => response.json())
          )
        );
      })
      .then((stories) => {
        setNews(stories);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching news:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Container maxW="container.lg" p={4}>
      <Box as="nav" bg="gray.800" color="white" p={4} mb={4}>
        <Heading as="h1" size="lg">Hacker News Client</Heading>
      </Box>
      {loading ? (
        <Spinner size="xl" />
      ) : (
        <VStack spacing={4} align="stretch">
          {news.map((story) => (
            <Box key={story.id} p={4} borderWidth="1px" borderRadius="md">
              <Heading as="h2" size="md">
                <Link href={story.url} isExternal>
                  {story.title}
                </Link>
              </Heading>
              <Text>by {story.by}</Text>
            </Box>
          ))}
        </VStack>
      )}
    </Container>
  );
};

export default Index;