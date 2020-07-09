import { Box, Typography } from '@material-ui/core';
import { SelectInputProps } from '@material-ui/core/Select/SelectInput';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { DateTime } from 'luxon';
import React, { useCallback, useEffect, useState } from 'react';
import CustomSelect from '../../../components/CustomSelect';
import OutlinedBox from '../../../components/OutlinedBox';
import { Tutorial } from '../../../model/Tutorial';
import { compareDateTimes } from '../../../util/helperFunctions';
import { useSubstituteManagementContext } from '../SubstituteManagement.context';
import { FilterOption } from '../SubstituteManagement.types';

const useStyles = makeStyles((theme) =>
  createStyles({
    scrollableBox: {
      overflowY: 'auto',
      ...theme.mixins.scrollbar(8),
    },
    dateButton: {
      marginTop: theme.spacing(1.5),
      '&:first-of-type': {
        marginTop: 0,
      },
    },
    dateButtonIcon: {
      marginLeft: 'auto',
    },
  })
);

interface Props {}

type CallbackType = NonNullable<SelectInputProps['onChange']>;

function filterDates(tutorial: Tutorial | undefined, option: FilterOption): DateTime[] {
  if (!tutorial) {
    return [];
  }

  return tutorial.dates
    .filter((date) => {
      switch (option) {
        case FilterOption.ONLY_FUTURE_DATES:
          const diff = date.startOf('days').diffNow('days').days;
          return Math.ceil(diff) >= 0;
        case FilterOption.ALL_DATES:
          return true;
        case FilterOption.WITH_SUBSTITUTE:
          return tutorial.getSubstitute(date) !== undefined;
        case FilterOption.WITHOUT_SUBSTITUTE:
          return tutorial.getSubstitute(date) === undefined;
        default:
          return true;
      }
    })
    .sort(compareDateTimes);
}

function DateBox({}: Props): JSX.Element {
  const classes = useStyles();
  const {
    tutorial: { value: tutorial },
  } = useSubstituteManagementContext();

  const [filterOption, setFilterOption] = useState<FilterOption>(
    () => FilterOption.ONLY_FUTURE_DATES
  );
  const [datesToShow, setDatesToShow] = useState<DateTime[]>(() =>
    filterDates(tutorial, filterOption)
  );

  useEffect(() => {
    setDatesToShow(filterDates(tutorial, filterOption));
  }, [tutorial, filterOption]);

  const handleChange = useCallback<CallbackType>((e) => {
    if (typeof e.target.value !== 'string') {
      return;
    }

    const selectedOption: FilterOption | undefined = Object.values(FilterOption).find(
      (op) => op === e.target.value
    );

    if (!selectedOption) {
      throw new Error('Selected filter option is not a valid one.');
    }

    setFilterOption(selectedOption);
  }, []);

  return (
    <Box display='flex' flexDirection='column' className={classes.scrollableBox}>
      <Typography variant='h6' style={{ marginBottom: 8 * 1.5 }}>
        Datum auswählen
      </Typography>

      <CustomSelect
        label='Filtern'
        items={Object.values(FilterOption)}
        itemToValue={(item) => item}
        itemToString={(item) => item}
        value={filterOption}
        onChange={handleChange}
      />

      <OutlinedBox
        flex={1}
        display='flex'
        flexDirection='column'
        marginTop={1.5}
        padding={1}
        className={classes.scrollableBox}
      >
        {/* {datesToShow.map((date) => (
          <Button
            variant='outlined'
            color={date === selectedDate ? 'primary' : 'default'}
            key={date.toISODate()}
            className={classes.dateButton}
            classes={{ endIcon: classes.dateButtonIcon }}
            endIcon={<RightArrow />}
            onClick={() => setSelectedDate(date)}
          >
            <Box
              display='flex'
              flexDirection='column'
              textAlign='left'
              style={{ textTransform: 'none' }}
            >
              <DateOrIntervalText date={date} />
              {
                <Typography variant='caption'>
                  {!!tutorial.getSubstitute(date)
                    ? `Vertretung: ${getNameOfEntity(tutorial.getSubstitute(date)!)}`
                    : 'Keine Vertretung'}
                </Typography>
              }
            </Box>
          </Button>
        ))} */}
        {datesToShow.length === 0 && (
          <Typography align='center'>Keine entsprechenden Termine gefunden.</Typography>
        )}
      </OutlinedBox>
    </Box>
  );
}

export default DateBox;