import * as React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CopyAllOutlined from "@mui/icons-material/CopyAllOutlined";
import Container from "@mui/material/Container";
import format from "date-fns/format";

import dynamic from "next/dynamic";

import {
  copy,
  handleError,
  isServerSide,
  queryClient,
  request,
} from "@src/utils";
import { BasePageProps } from "@src/utils/interface";
import { TransactionHistory } from "./interface";
import { ButtonGroup } from "@mui/material";
import { useRouter } from "next/router";
import { useToast } from "@src/utils/hooks";
import useGloabalStyle from "@src/styles";

import ButtonComponent from "@src/components/shared/button";
import MuiTable from "@src/components/shared/table";
import Empty from "../shared/state/Empty";

export default function CustomizedSteppers() {
  const Toast = dynamic(() => import("@src/components/shared/toast"));
  const ConfirmPayment = dynamic(
    () => import("@src/components/payment/confirmPayment")
  );
  const BankTransfer = dynamic(() => import("./walletToBankTransfer"));
  const WalletToWalletTransfer = dynamic(
    () => import("./walletToWalletTransfer")
  );
  const CreditWallet = dynamic(() => import("./creditWallet"));
  const globalStyles = useGloabalStyle();
  const { toastMessage, toggleToast } = useToast();
  const [transactionType, setTransactionType] = React.useState("all");
  const { pageData, cachedData } = queryClient.getQueryData(
    "pageProps"
  ) as BasePageProps;
  const [transactions, setTransaction] = React.useState<TransactionHistory[]>(
    pageData.transactionHistory.histories
  );
  const router = useRouter();
  const { walletBalance } = pageData;
  const pockets = Object.keys(walletBalance.pockets);
  const columns = [
    { minWidth: 50, name: "No", key: "index" },
    { minWidth: 130, name: "Date", key: "date" },
    { minWidth: 100, name: "Amount", key: "amount" },
    { minWidth: 130, name: "Balance", key: "balance" },
    { minWidth: 250, name: "Naration", key: "narration" },
    { minWidth: 70, name: "Currency", key: "currency" },
    { minWidth: 70, name: "Type", key: "type" },
    { minWidth: 250, name: "Reference", key: "reference" },
  ];

  const data = transactions?.map((item, index) => ({
    index: ++index,
    date: format(new Date(item.createdAt), "dd-MM-yyy"),
    ...item,
  }));
  async function getTransactions(type: string) {
    try {
      setTransactionType(type);
      if (type === "all") {
        setTransaction([...pageData.transactionHistory.histories]);
      } else {
        const { data } = await request.get({
          url: cachedData?.centre?.id
            ? `/wallet/centre/${cachedData.centre.id}/transaction-history?type=${type}`
            : `/wallet/transaction-history?type=${type}`,
        });
        setTransaction([...(data.histories as TransactionHistory[])]);
      }
    } catch (error) {
      toggleToast(handleError(error).message);
    }
  }
  return (
    <Box sx={{ pt: 7, pb: 8, px: { md: 6 } }}>
      <Container maxWidth="xl">
        {router.query.reference && (
          <ConfirmPayment
            reference={router.query.reference}
            price={Number(router.query.price)}
            redirectUrl={isServerSide ? "" : window.location.href}
          />
        )}
        <Stack spacing={4} marginTop={4}>
          <Stack direction={{ md: "row" }} spacing={4}>
            <Box
              className={globalStyles.bgGradient}
              sx={{
                padding: 3,
                width: { xs: "100%", md: "75%" },
                borderRadius: 3,
              }}
            >
              {" "}
              <Typography
                variant="h5"
                component="p"
                style={{ color: "#fff", marginBottom: 20 }}
              >
                ID:{" "}
                {cachedData?.centre?.id
                  ? cachedData.centre.id
                  : cachedData.user.id}{" "}
                <CopyAllOutlined
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    copy(
                      cachedData?.centre?.id
                        ? cachedData.centre.id
                        : cachedData.user.id
                    );
                    toggleToast("copied!");
                  }}
                />
              </Typography>
              <Typography
                variant="h5"
                component="p"
                style={{ color: "#fff", marginBottom: 20 }}
              >
                Wallet Balance
              </Typography>
              <Box sx={{ display: "flex" }}>
                {pockets.map((pocket, index) => (
                  <Typography
                    key={`${pocket}-${index}`}
                    variant="h4"
                    component="p"
                    style={{ color: "#fff", marginBottom: 20, marginRight: 30 }}
                  >
                    {walletBalance.pockets[pocket].symbol}
                    {walletBalance.pockets[pocket].balance}
                  </Typography>
                ))}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: { xs: "column", md: "row" },
                }}
              >
                <CreditWallet centreId={cachedData.centre.id} />
                <WalletToWalletTransfer
                  toggleToast={toggleToast}
                  centreId={cachedData.centre.id}
                />
                <BankTransfer
                  toggleToast={toggleToast}
                  centreId={cachedData.centre.id}
                />
              </Box>
            </Box>
            <Box
              sx={{
                background: "#FAEFE8",
                mt: { xs: 4 },
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                borderRadius: 3,
                padding: 4,
                width: { xs: "100%", md: "25%" },
              }}
            >
              <Typography
                variant="h5"
                component="p"
                color="primary"
                sx={{
                  marginBottom: 2,
                }}
              >
                Total balance in USD
              </Typography>
              <Typography
                variant="h4"
                component="p"
                color="primary"
                sx={{ marginBottom: 2 }}
              >
                ${walletBalance.usdBalance}
              </Typography>
            </Box>
          </Stack>

          <Box>
            <Typography variant="h4" component="p">
              Transactions
            </Typography>
            <ButtonGroup
              size="large"
              sx={{
                background: "#FAEFE8",
                mt: 2,
              }}
            >
              <ButtonComponent
                variant={transactionType === "all" ? "contained" : "text"}
                onClick={() => getTransactions("all")}
              >
                All Transactions
              </ButtonComponent>
              <ButtonComponent
                variant={transactionType === "CREDIT" ? "contained" : "text"}
                onClick={() => getTransactions("CREDIT")}
              >
                Deposits
              </ButtonComponent>
              <ButtonComponent
                variant={transactionType === "DEBIT" ? "contained" : "text"}
                onClick={() => getTransactions("DEBIT")}
              >
                Withdrawals
              </ButtonComponent>
            </ButtonGroup>
          </Box>
          {data.length > 0 ? (
            <Box sx={{ width: { xs: 400, md: "100%" } }}>
              <MuiTable data={data} columns={columns} bgColor="#F7F7F7" />
            </Box>
          ) : (
            <Empty />
          )}
          {toastMessage && (
            <Toast
              message={toastMessage}
              status={Boolean(toastMessage)}
              showToast={toggleToast}
            />
          )}
        </Stack>
      </Container>
    </Box>
  );
}
