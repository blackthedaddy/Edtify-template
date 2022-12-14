import Typography from "@mui/material/Typography";
import ButtonComponent from "@src/components/shared/button";
import Toast from "@src/components/shared/toast";
import Loading from "@src/components/shared/loading";
import { handleError, request } from "@src/utils";
import { useRouter } from "next/router";
import { useState } from "react";
import TextFields from "@src/components/shared/input/textField";
import useForm from "@src/hooks/useForm";
import { useToast } from "@src/utils/hooks";

const EmailVerification = () => {
  const { toastMessage, toggleToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { getData, values, submit } = useForm(resendVerificationToken);
  const router = useRouter();
  const [tokenExpired, setTokenExpired] = useState(false);

  async function emailVerification() {
    try {
      setIsLoading(true);
      const { data } = await request.get({
        url: `/auth/verification/email/${router.query.token}`,
      });
      toggleToast(data.message);
      setIsLoading(false);
      router.replace("https://contentionary.com/");
    } catch (error) {
      if (handleError(error).message === "jwt expired") setTokenExpired(true);
      toggleToast(handleError(error).message);
      setIsLoading(false);
    }
  }

  async function resendVerificationToken() {
    try {
      setIsLoading(true);
      const { message } = await request.post({
        url: `/auth/verification/email`,
        data: values,
      });
      toggleToast(message);
      setIsLoading(false);
    } catch (error) {
      toggleToast(handleError(error).message);
      setIsLoading(false);
    }
  }
  return (
    <div
      style={{
        background: "#dbdbdb",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {tokenExpired ? (
        <div style={{ textAlign: "center" }}>
          <Typography sx={{ mb: 2 }} variant="h5">
            Token expired, kindly request for a new token.
          </Typography>
          <form
            onSubmit={(e) => {
              submit(e);
            }}
          >
            <TextFields
              type="email"
              label="Enter your email address"
              name="email"
              onChange={getData}
              sx={{ mb: 2, width: 350 }}
              required={true}
            />
            <br />
            <ButtonComponent variant="contained" size="large" type="submit">
              <>
                Resend account verification token
                {isLoading && (
                  <Loading sx={{ color: "#fff", ml: 1 }} size={15} />
                )}
              </>
            </ButtonComponent>
          </form>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <Typography sx={{ mb: 1 }}>
            Kindly proccess to verify your account
          </Typography>
          <ButtonComponent
            variant="contained"
            size="large"
            onClick={() => emailVerification()}
          >
            <>
              Account Verification{" "}
              {isLoading && <Loading sx={{ color: "#fff", ml: 1 }} size={15} />}
            </>
          </ButtonComponent>
        </div>
      )}

      {Boolean(toastMessage) && (
        <Toast
          message={toastMessage}
          showToast={toggleToast}
          status={Boolean(toastMessage)}
        />
      )}
    </div>
  );
};

export default EmailVerification;
