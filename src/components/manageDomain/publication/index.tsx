import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";

import PublicationCard from "./PublicationCard";
import Grid from "@mui/material/Grid";
import { BasePageProps, PublicationInt } from "@src/utils/interface";
import { queryClient } from "@src/utils";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const PublicationAdmin = () => {
  const router = useRouter();
  const { pageData, cachedData } = queryClient.getQueryData(
    "pageProps"
  ) as BasePageProps;
  const { publications } = pageData.publicationLists as {
    publications: PublicationInt[];
  };
  const { folderId } = router.query;
  const Empty = dynamic(() => import("@src/components/shared/state/Empty"));
  const Menu = dynamic(() => import("./menu"));
  const Breadcrumbs = dynamic(
    () => import("@src/components/shared/breadcrumbs")
  );
  const pageCount = pageData.publicationLists.pageCount as number;
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    router.replace({
      query: { ...router.query, pageId: value },
    });
  };
  const links = [
    { link: "/admin", name: "Dashboard" },
    { link: "/admin/publication", name: "Publications" },
  ];

  return (
    <Box mt={2}>
      <Breadcrumbs
        links={folderId ? links : [{ link: "/admin", name: "Dashboard" }]}
        currentPage={
          folderId
            ? { name: "Folder", link: "/" }
            : { link: "/admin/publication", name: "Publications" }
        }
      />
      <Box
        sx={{
          textAlign: "right",
        }}
      >
        <Menu folderId={folderId as string} centreId={cachedData.centre.id} />
      </Box>
      {publications.length ? (
        <>
          <Grid
            container
            mb={{ xs: 1, md: 2, xl: 3 }}
            spacing={{ xs: 1, md: 2, xl: 3 }}
            columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
          >
            {publications?.map((publication, index) => (
              <Grid key={`${index}-publication-card`} item xs={1}>
                <PublicationCard {...publication} />
              </Grid>
            ))}
          </Grid>{" "}
          <Stack py={4} direction="row" justifyContent="center" spacing={2}>
            {pageCount > 1 && (
              <Pagination
                count={pageCount}
                onChange={handleChange}
                shape="rounded"
                size="large"
              />
            )}
          </Stack>
        </>
      ) : (
        <Empty
          href={`/admin/publication/create?type=PUBLICATION&folderId=${folderId}`}
          buttonText="Create publication"
        />
      )}
    </Box>
  );
};

export default PublicationAdmin;
