import { Box, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useFormikContext } from 'formik';
import React, { useCallback, useEffect, useMemo } from 'react';
import ShortTestForm, { ShortTestFormState } from '../../../components/forms/ShortTestForm';
import { useMapColumnsHelpers } from '../../../components/import-csv/hooks/useMapColumnsHelpers';
import { useStepper } from '../../../components/stepper-with-buttons/context/StepperContext';
import { useCustomSnackbar } from '../../../hooks/snackbar/useCustomSnackbar';
import { FormikSubmitCallback } from '../../../types';
import { ShortTestColumns } from '../ImportShortTests';

const useStyles = makeStyles((theme) =>
  createStyles({
    form: {
      marginTop: theme.spacing(4),
    },
  })
);

function useStepperNextCallback(callback: () => unknown | Promise<unknown>): void {
  const { setNextCallback, removeNextCallback } = useStepper();

  useEffect(() => {
    setNextCallback(async () => {
      const isSuccess = await callback();

      if (!!isSuccess) {
        return { goToNext: false };
      } else {
        return { goToNext: false, error: true };
      }
    });

    return () => removeNextCallback();
  }, [setNextCallback, removeNextCallback, callback]);
}

function HookUpStepper(): null {
  const { submitForm } = useFormikContext<ShortTestFormState>();

  useStepperNextCallback(submitForm);

  return null;
}

function AdjustGeneratedShortTest(): JSX.Element {
  const classes = useStyles();
  const { data, mappedColumns } = useMapColumnsHelpers<ShortTestColumns>();
  const { enqueueSnackbar } = useCustomSnackbar();

  const initialValues: ShortTestFormState = useMemo(
    () => ({
      shortTestNo: '',
      percentageNeeded: 0.5,
      exercises: [
        {
          exName: 'Gesamter Test',
          maxPoints: data.rows[0]?.data[mappedColumns.testMaximumPoints] ?? '0',
          bonus: false,
          subexercises: [],
        },
      ],
    }),
    [data.rows, mappedColumns.testMaximumPoints]
  );

  const handleSubmit: FormikSubmitCallback<ShortTestFormState> = useCallback(async (values) => {
    return true;
  }, []);

  return (
    <Box display='flex' flexDirection='column' flex={1}>
      <Typography variant='h4'>Importierten Kurztest anpassen</Typography>

      <ShortTestForm
        onSubmit={handleSubmit}
        initialValues={initialValues}
        className={classes.form}
        hideSaveButton
      >
        <HookUpStepper />
      </ShortTestForm>
    </Box>
  );
}

export default AdjustGeneratedShortTest;
