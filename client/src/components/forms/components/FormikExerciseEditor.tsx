import { Button, IconButton } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import { FieldArray, FieldArrayRenderProps, useField } from 'formik';
import {
  MinusBox as MinusIcon,
  PlusBox as PlusIcon,
  TimelinePlusOutline as PlusSubIcon,
} from 'mdi-material-ui';
import React from 'react';
import { Exercise } from 'shared/dist/model/Sheet';
import FormikCheckbox from './FormikCheckbox';
import FormikTextField from './FormikTextField';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    exerciseBox: {
      gridColumn: '1 / span 2',
      display: 'flex',
      flexDirection: 'column',
    },
    exercise: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr max-content 56px',
      gridColumnGap: theme.spacing(1),
      borderBottom: `1.5px solid ${theme.palette.divider}`,
      padding: theme.spacing(1.5, 2, 1.5, 2),
      justifyContent: 'center',
      marginTop: theme.spacing(1),
      '&:first-of-type': {
        borderTop: `1.5px solid ${theme.palette.divider}`,
      },
    },
    subexerciseBox: {
      display: 'flex',
      flexDirection: 'column',
      gridColumn: '1 / -1',
    },
    subexercise: {
      paddingLeft: theme.spacing(3),
      paddingRight: 0,
      borderBottom: 'none',
      marginTop: 0,
      '&:first-of-type': {
        marginTop: theme.spacing(1),
      },
      '&:last-of-type': {
        paddingBottom: 0,
      },
    },
    addButton: {
      marginTop: theme.spacing(1),
    },
    addSubexerciseButton: {
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(2),
      justifyContent: 'flex-start',
    },
    deleteButton: {
      color: theme.palette.error.light,
    },
    iconInButton: {
      marginRight: theme.spacing(1),
    },
    errorMessage: {
      color: theme.palette.error.main,
      textAlign: 'right',
    },
  })
);

export interface ExerciseFormExercise {
  id?: string;
  exName: string;
  maxPoints: string;
  bonus: boolean;
  subexercises: ExerciseFormExercise[];
}

export function mapExerciseToFormExercise({
  id,
  exName,
  maxPoints,
  bonus,
  subexercises,
}: Exercise): ExerciseFormExercise {
  return {
    id,
    exName,
    maxPoints: maxPoints.toString(),
    bonus,
    subexercises: subexercises.map(mapExerciseToFormExercise),
  };
}

interface Props {
  name: string;
  disableAutofocus?: boolean;
}

interface ExerciseDataFieldsProps {
  namePrefix: string;
  disablePoints?: boolean;
  disableAutofocus?: boolean;
}

function getNewExercise(exName: string = ''): ExerciseFormExercise {
  return {
    id: undefined,
    exName,
    maxPoints: '0.0',
    bonus: false,
    subexercises: [],
  };
}

function ExerciseDataFields({
  namePrefix,
  disablePoints,
  disableAutofocus,
}: ExerciseDataFieldsProps): JSX.Element {
  return (
    <>
      <FormikTextField
        name={`${namePrefix}.exName`}
        label='Aufgabenbezeichnung'
        fullWidth={false}
        autoFocus={!disableAutofocus}
      />

      <FormikTextField
        name={`${namePrefix}.maxPoints`}
        label='Punkte'
        type='number'
        fullWidth={false}
        inputProps={{ min: 0, step: 0.1 }}
        disabled={disablePoints}
      />

      <FormikCheckbox name={`${namePrefix}.bonus`} label='Bonusaufgabe' />
    </>
  );
}

function FormikExerciseEditor({ name, disableAutofocus }: Props): JSX.Element {
  const classes = useStyles();
  const [{ value }] = useField(name);

  const exercises: ExerciseFormExercise[] = value || [];

  function handleCreateExercise(arrayHelpers: FieldArrayRenderProps) {
    return () => {
      const exercise: ExerciseFormExercise = getNewExercise((exercises.length + 1).toString());

      arrayHelpers.push(exercise);
    };
  }

  function handleExerciseDelete(idx: number, arrayHelpers: FieldArrayRenderProps) {
    return () => {
      const exercises: readonly ExerciseFormExercise[] = arrayHelpers.form.values[name];
      const updatedExercises = [...exercises.slice(0, idx), ...exercises.slice(idx + 1)];

      arrayHelpers.form.setFieldValue(name, updatedExercises);
    };
  }

  function handleAddSubexercise(idx: number, arrayHelpers: FieldArrayRenderProps) {
    return () => {
      const exercise: ExerciseFormExercise = value[idx];

      exercise.subexercises.push(getNewExercise());

      arrayHelpers.replace(idx, exercise);
    };
  }

  function handleDeleteSubexercise(
    exIdx: number,
    subIdx: number,
    arrayHelpers: FieldArrayRenderProps
  ) {
    return () => {
      const exercise: ExerciseFormExercise = value[exIdx];
      const updatedSubexercises = [
        ...exercise.subexercises.slice(0, subIdx),
        ...exercise.subexercises.slice(subIdx + 1),
      ];

      exercise.subexercises = updatedSubexercises;

      arrayHelpers.replace(exIdx, exercise);
    };
  }

  return (
    <FieldArray
      name={name}
      render={arrayHelpers => (
        <div className={classes.exerciseBox}>
          {exercises.map((ex, idx) => (
            <React.Fragment key={idx}>
              <div className={classes.exercise}>
                {/* TODO: Add calculation of points if there are subexercises. */}
                <ExerciseDataFields
                  namePrefix={`${name}.${idx}`}
                  disablePoints={ex.subexercises.length > 0}
                  disableAutofocus={disableAutofocus}
                />

                <IconButton
                  className={classes.deleteButton}
                  onClick={handleExerciseDelete(idx, arrayHelpers)}
                >
                  <MinusIcon />
                </IconButton>

                <div className={classes.subexerciseBox}>
                  {ex.subexercises.map((_, subIdx) => (
                    <div
                      key={`sub-ex-${subIdx}`}
                      className={clsx(classes.exercise, classes.subexercise)}
                    >
                      <ExerciseDataFields
                        namePrefix={`${name}.${idx}.subexercises.${subIdx}`}
                        disableAutofocus={disableAutofocus}
                      />

                      <IconButton
                        className={classes.deleteButton}
                        onClick={handleDeleteSubexercise(idx, subIdx, arrayHelpers)}
                      >
                        <MinusIcon />
                      </IconButton>
                    </div>
                  ))}

                  <Button
                    className={classes.addSubexerciseButton}
                    onClick={handleAddSubexercise(idx, arrayHelpers)}
                  >
                    <PlusSubIcon className={classes.iconInButton} />
                    Neue Teilaufgabe hinzufügen
                  </Button>
                </div>
              </div>
            </React.Fragment>
          ))}

          <Button
            className={classes.addButton}
            color='secondary'
            size='large'
            onClick={handleCreateExercise(arrayHelpers)}
          >
            <PlusIcon className={classes.iconInButton} />
            Neue Aufgabe hinzufügen
          </Button>
        </div>
      )}
    />
  );
}

export default FormikExerciseEditor;
