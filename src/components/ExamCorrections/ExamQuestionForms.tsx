import React from "react";
// mui components
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
//
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
// interface styles and configs
import useButtonStyle from "@src/styles/button";
import { QuestionInt } from "@src/utils/interface";

interface QuestionSelectorInt {
  questionId: string;
  question: QuestionInt;
}

export const ObjectiveQuestionSelector = (props: QuestionSelectorInt) => {
  const buttonStyle = useButtonStyle();
  // selected option
  const [value, setValue] = React.useState<number>();

  // set option if in cache
  React.useEffect(() => {
    if (props.question && props.question.options) {
      props.question.options.map(({ id, isCorrect }) => {
        if (isCorrect) setValue(Number(id));
      });
    } else {
      setValue(undefined);
    }
  }, [props.question]);

  return (
    <ToggleButtonGroup
      exclusive
      value={value}
      orientation="vertical"
      className={buttonStyle.examButtonGroup}
    >
      {props?.question?.options?.map((option, index) => (
        <ToggleButton
          key={`objective-option-${option.id}`}
          value={option.id as number}
          aria-label={`option ${index + 1}`}
        >
          <Stack direction="row" spacing={2}>
            <Typography color="inherit" mb={0} paragraph>
              {index + 1}). &nbsp;
            </Typography>
            <Box
              dangerouslySetInnerHTML={{ __html: option.value }}
              sx={{
                "& p": { margin: 0 },
                "& > :first-of-type": { marginBottom: 0 },
              }}
            />
          </Stack>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export const BooleanQuestionSelector = (props: QuestionSelectorInt) => {
  const buttonStyle = useButtonStyle();
  //
  const [option, setOption] = React.useState<string>();
  // set option if in cache
  React.useEffect(() => {
    if (props.question.answer) {
      setOption(String(props.question.answer));
    } else {
      setOption(undefined);
    }
  }, [props.question]);
  return (
    <ToggleButtonGroup
      exclusive
      value={option}
      orientation="vertical"
      className={buttonStyle.examButtonGroup}
    >
      <ToggleButton value={"true"} aria-label="option true">
        A). True
      </ToggleButton>
      <ToggleButton value={"false"} aria-label="option false">
        B). False
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export const MultichoiceQuestionSelector = (props: QuestionSelectorInt) => {
  const [choice, setChoice] = React.useState<Array<number>>([]);
  // set option if in cache
  React.useEffect(() => {
    if (props.question && props.question.options) {
      props.question.options.map(({ isCorrect, id }) => {
        if (isCorrect) {
          choice.push(Number(id));
          setChoice([...choice]);
        }
      });
    }
  }, [props.question]);

  return (
    <FormGroup>
      {props?.question?.options?.map((option) => (
        <FormControlLabel
          key={`multichoice-option-${option.id}`}
          control={
            <Checkbox
              name={String(option.id)}
              checked={choice.includes(option.id as number)}
            />
          }
          label={
            <Box
              dangerouslySetInnerHTML={{ __html: option.value }}
              sx={{ "& > :first-of-type": { marginTop: 0, paddingTop: 0 } }}
            />
          }
        />
      ))}
    </FormGroup>
  );
};

export const RangeQuestionSelector = (props: QuestionSelectorInt) => {
  const [minValue, setMinValue] = React.useState<string>("");
  const [maxValue, setMaxValue] = React.useState<string>("");
  //
  React.useEffect(() => {
    if (props.question) {
      setMinValue(String(props.question?.min ?? ""));
      setMaxValue(String(props.question?.max ?? ""));
    } else {
      setMinValue("");
      setMaxValue("");
    }
  }, [props.question]);

  return (
    <>
      <Typography mt={1} fontWeight="light" variant="subtitle2">
        Minimum value:
      </Typography>
      <Typography>{minValue}</Typography>

      <Typography mt={1} fontWeight="light" variant="subtitle2">
        Maximum Value:
      </Typography>
      <Typography>{maxValue}</Typography>
    </>
  );
};
