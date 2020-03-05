import { CircularProgress, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { IExercise, ISheet } from 'shared/model/Sheet';
import BackButton from '../../../components/BackButton';
import CustomSelect, { CustomSelectProps } from '../../../components/CustomSelect';
import { getSheet } from '../../../hooks/fetching/Sheet';
import { useErrorSnackbar } from '../../../hooks/useErrorSnackbar';
import { HasPoints } from '../../../typings/types';
import { getPointOverviewPath } from '../../../routes/Routing.helpers';
import Placeholder from '../../../components/Placeholder';
import EnterPointsForm from './components/EnterPointsForm';
import { PointsFormSubmitCallback } from './components/EnterPointsForm.helpers';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
    },
    topBar: {
      display: 'flex',
      marginBottom: theme.spacing(3),
    },
    titleSpinner: {
      margin: theme.spacing(0, 1),
    },
    backButton: {
      marginRight: theme.spacing(2),
      alignSelf: 'center',
    },
    topBarSelect: {
      marginRight: theme.spacing(1),
      flex: 1,
      '&:last-of-type': {
        marginRight: 0,
      },
    },
    enterPointsForm: {
      flex: 1,
    },
  })
);

interface EntitySelectProps<T extends HasPoints> {
  label: string;
  emptyPlaceholder: string;
  itemToString: CustomSelectProps<T>['itemToString'];
  onChange?: CustomSelectProps<T>['onChange'];
}

interface Props<T extends HasPoints> {
  tutorialId: string;
  sheetId: string;
  entity?: T;
  onSubmit: PointsFormSubmitCallback;

  allEntities: T[];
  entitySelectProps: EntitySelectProps<T>;
}

function EnterPoints<T extends HasPoints>({
  tutorialId,
  sheetId,
  entity,
  onSubmit,
  allEntities,
  entitySelectProps,
}: Props<T>): JSX.Element {
  const classes = useStyles();

  const { setError } = useErrorSnackbar();

  const [sheet, setSheet] = useState<ISheet>();
  const [selectedExercise, setSelectedExercise] = useState<IExercise>();

  useEffect(() => {
    if (!sheetId) {
      return;
    }

    getSheet(sheetId)
      .then(response => {
        setSheet(response);
        setSelectedExercise(response.exercises[0]);
      })
      .catch(() => setError('Übungsblatt konnte nicht abgerufen werden.'));
  }, [sheetId, setError]);

  const handleExerciseChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    if (!sheet) {
      return;
    }

    const exerciseId: string = event.target.value as string;
    const exercise = sheet.exercises.find(ex => ex.id === exerciseId);

    if (exercise) {
      setSelectedExercise(exercise);
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.topBar}>
        <BackButton
          to={getPointOverviewPath({ tutorialId, sheetId })}
          className={classes.backButton}
        />

        <Typography variant='h4'>
          Punkte für Übungsblatt{' '}
          {sheet ? (
            `#${sheet.sheetNo}`
          ) : (
            <CircularProgress size={34} className={classes.titleSpinner} color='inherit' />
          )}{' '}
          eintragen
        </Typography>
      </div>

      <div className={classes.topBar}>
        <CustomSelect
          className={classes.topBarSelect}
          label='Aufgabe'
          emptyPlaceholder='Keine Aufgaben verfügbar'
          items={sheet ? sheet.exercises : []}
          itemToString={ex => `Aufgabe ${ex.exName}`}
          itemToValue={ex => ex.id}
          value={selectedExercise?.id ?? ''}
          onChange={handleExerciseChange}
        />

        <CustomSelect
          className={classes.topBarSelect}
          items={allEntities}
          itemToValue={item => item.id}
          value={entity?.id ?? ''}
          {...entitySelectProps}
        />
      </div>

      <Placeholder
        placeholderText='Es muss zuerst eine Aufgabe ausgewählt werden.'
        showPlaceholder={!selectedExercise}
        loading={!sheet || !entity}
      >
        {entity && sheet && selectedExercise && (
          <EnterPointsForm
            key={sheet.id}
            entity={entity}
            sheet={sheet}
            exercise={selectedExercise}
            className={classes.enterPointsForm}
            onSubmit={onSubmit}
          />
        )}
      </Placeholder>
    </div>
  );
}

export default EnterPoints;
