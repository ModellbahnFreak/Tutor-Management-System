import { Button, IconButton, TableCell, TableRow } from '@material-ui/core';
import { AvatarProps } from '@material-ui/core/Avatar';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { TableRowProps } from '@material-ui/core/TableRow';
import clsx from 'clsx';
import {
  AccountSwitch,
  ChevronDown as KeyboardArrowDownIcon,
  EmailOutline as MailIcon,
} from 'mdi-material-ui';
import React, { useState } from 'react';
import { ScheinCriteriaSummary } from 'shared/dist/model/ScheinCriteria';
import { Tutorial } from 'shared/dist/model/Tutorial';
import EntityListItemMenu from '../../../../components/list-item-menu/EntityListItemMenu';
import PaperTableRow from '../../../../components/PaperTableRow';
import StudentAvatar from '../../../../components/student-icon/StudentAvatar';
import { SvgIconComponent } from '../../../../typings/SvgIconComponent';
import { StudentWithFetchedTeam } from '../../../../typings/types';
import { getDisplayStringForTutorial } from '../../../../util/helperFunctions';
import ScheinCriteriaStatusTable from '../../../management/components/ScheinCriteriaStatusTable';
import StatusProgress from '../../../management/components/StatusProgress';
import { ListItem } from '../../../../components/list-item-menu/ListItemMenu';
import { Link } from 'react-router-dom';
import { getStudentInfoPath } from '../../../../routes/Routing.helpers';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    statusProgress: {
      maxWidth: '200px',
      // width: '50%',
      margin: theme.spacing(1),
    },
    content: {
      '&:hover': {
        background: 'rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
      },
      '& td': {
        // This prevents table-cells from getting too small if other cells take up more space.
        whiteSpace: 'nowrap',
        '&:nth-last-of-type(2)': {
          width: '100%',
        },
      },
    },
    infoBlock: {
      display: 'grid',
      gridRowGap: theme.spacing(1),
      gridColumnGap: theme.spacing(2),
      gridTemplateColumns: 'max-content 1fr',
    },
    noBottomBorder: {
      '& > td': {
        borderBottom: 'none',
      },
    },
    showInfoIcon: {
      transition: theme.transitions.create('transform', {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter,
      }),
      transform: 'rotate(0deg)',
    },
    showInfoIconOpened: {
      transform: 'rotate(-180deg)',
    },
    infoRowCell: {
      paddingTop: theme.spacing(0),
    },
    infoRowContent: {
      maxWidth: '95%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    infoRowTable: {
      width: 'unset',
    },
    progressBarCell: {
      width: '100%',
    },
    emailButton: {
      paddingRight: theme.spacing(1),
    },
    emailIcon: {
      marginLeft: theme.spacing(1),
    },
  })
);

interface Props extends TableRowProps {
  student: StudentWithFetchedTeam;
  showTutorial?: boolean;
  tutorials?: Tutorial[];
  summary?: ScheinCriteriaSummary;
  onEditStudentClicked: (student: StudentWithFetchedTeam) => void;
  onDeleteStudentClicked: (student: StudentWithFetchedTeam) => void;
  onChangeTutorialClicked?: (student: StudentWithFetchedTeam) => void;
}

interface CustomAvatarProps {
  icon?: SvgIconComponent;
  AvatarProps?: AvatarProps;
  avatarTooltip?: string;
}

function calculateProgress(summary: ScheinCriteriaSummary) {
  let achieved = 0;
  let total = 0;

  Object.values(summary.scheinCriteriaSummary).forEach(status => {
    const infos = Object.values(status.infos);

    if (status.passed) {
      achieved += 1;
      total += 1;
    } else {
      if (infos.length > 0) {
        infos.forEach(info => {
          achieved += info.achieved / info.total;
          total += 1;
        });
      } else {
        achieved += status.achieved / status.total;
        total += 1;
      }
    }
  });

  return (achieved / total) * 100;
}

function ExtendableStudentRow({
  student,
  className,
  onClick,
  showTutorial,
  tutorials,
  summary,
  onEditStudentClicked,
  onDeleteStudentClicked,
  onChangeTutorialClicked,
  ...rest
}: Props): JSX.Element {
  const { firstname, lastname, team } = student;
  const classes = useStyles();

  const [showInfoBox, setShowInfoBox] = useState(false);

  const tutorial = tutorials && tutorials.find(t => t.id === student.tutorial);
  const additionalMenuItems: ListItem[] = [
    {
      primary: 'E-Mail',
      Icon: MailIcon,
      disabled: !student.email,
      onClick: () => {
        window.location.href = `mailto:${student.email}`;
      },
    },
  ];

  if (onChangeTutorialClicked) {
    additionalMenuItems.push({
      primary: 'Tutorium wechseln',
      onClick: () => onChangeTutorialClicked(student),
      Icon: AccountSwitch,
    });
  }

  return (
    <>
      <PaperTableRow
        {...rest}
        label={`${lastname}, ${firstname}`}
        subText={
          showTutorial && !!tutorial
            ? `${getDisplayStringForTutorial(tutorial)} - ${
                team ? `Team: #${team.teamNo.toString().padStart(2, '0')}` : 'Kein Team'
              }`
            : `${team ? `Team: #${team.teamNo.toString().padStart(2, '0')}` : 'Kein Team'}`
        }
        Avatar={<StudentAvatar student={student} />}
        className={clsx(classes.content, className, showInfoBox && classes.noBottomBorder)}
        onClick={() => {
          setShowInfoBox(!showInfoBox);
        }}
        buttonCellContent={
          <>
            <IconButton
              className={clsx(classes.showInfoIcon, showInfoBox && classes.showInfoIconOpened)}
              onClick={e => {
                e.stopPropagation();
                setShowInfoBox(!showInfoBox);
              }}
            >
              <KeyboardArrowDownIcon />
            </IconButton>
            <EntityListItemMenu
              onEditClicked={() => onEditStudentClicked(student)}
              onDeleteClicked={() => onDeleteStudentClicked(student)}
              stopClickPropagation
              additionalItems={additionalMenuItems}
            />
          </>
        }
      >
        <TableCell className={classes.progressBarCell}>
          <StatusProgress
            className={classes.statusProgress}
            status={
              summary && {
                achieved: calculateProgress(summary),
                total: 100,
                passed: summary.passed,
              }
            }
          />
        </TableCell>

        <TableCell align='right' className={classes.emailButton}>
          <Button
            variant='outlined'
            component={Link}
            to={getStudentInfoPath({
              studentId: student.id,
              tutorialId: tutorial?.id,
            })}
          >
            Informationen
            <MailIcon className={classes.emailIcon} />
          </Button>
        </TableCell>
      </PaperTableRow>

      {showInfoBox && summary && (
        <TableRow>
          <TableCell className={classes.infoRowCell} align='center' colSpan={5}>
            <div className={classes.infoRowContent}>
              <ScheinCriteriaStatusTable summary={Object.values(summary.scheinCriteriaSummary)} />
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default ExtendableStudentRow;