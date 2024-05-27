import { useEffect, useState } from "react";
import { Container, Text, VStack, Box, Heading, Link, Spinner, Flex } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

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
      <Box as="nav" bg="brand.700" color="white" p={4} mb={6}>
        <Heading size="lg">Hacker News Client</Heading>
      </Box>
      {loading ? (
        <Flex justify="center" align="center" height="50vh">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <VStack spacing={4} align="stretch">
          {news.map((story) => (
            <Box key={story.id} p={4} borderWidth="1px" borderRadius="md">
              <Heading size="md">
                <Link href={story.url} isExternal>
                  {story.title} <ExternalLinkIcon mx="2px" />
                </Link>
              </Heading>
              <Text>By {story.by}</Text>
            </Box>
          ))}
        </VStack>
      )}
    </Container>
  );
};

export default Index;