import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import ShiftsTable from "../../components/shifts-table";
import { Column } from "../../components/shifts-table/models";
import { AllocateShiftType, ShiftType } from "../../shared/enums/shift-type";
import theme from "../../shared/theme";
import style from "./style.module.css";
import { ShiftAbTestConstraint, shiftAbTestScenarios } from "./test-cases";

const formatDate = (date: string) => new Date(date).toISOString().split("T")[0];
const formatTime = (seconds: number | null) =>
  seconds === null ? "לא נמדד" : `${seconds.toFixed(1)} שניות`;

const constraintTypeLabel: Record<ShiftAbTestConstraint["type"], string> = {
  MUST: "חייב",
  CANNOT: "אסור",
  PREFER: "מעדיף",
  PREFER_NOT: "מעדיף לא",
};

const getShiftTypeOptions = (allocateType: AllocateShiftType): ShiftType[] => {
  switch (allocateType) {
    case "FULL_DAY":
      return ["FULL_DAY"];
    case "PARTIAL_DAY":
      return ["DAY", "NOON"];
    case "DAY_NOON_NIGHT":
      return ["DAY", "NOON", "NIGHT"];
  }
};

const getDefaultShiftType = (allocateType: AllocateShiftType): ShiftType =>
  getShiftTypeOptions(allocateType)[0];

type ManualShiftRow = {
  id: string;
  date: string;
  userId: string;
  shiftType: ShiftType;
  rowIndex: number;
};

type AlgorithmResultRow = {
  id: string;
  date: string;
  userId: string;
  shiftType: ShiftType;
  rowIndex: number;
};

const createRows = (
  scenario: (typeof shiftAbTestScenarios)[number],
): ManualShiftRow[] =>
  scenario.shiftsDates.map((date, index) => ({
    id: `${date}-${index}`,
    date,
    userId: "",
    shiftType: getDefaultShiftType(scenario.shiftsType),
    rowIndex: index,
  }));

const validateConstraints = (
  rows: Array<{ date: string; userId: string; shiftType: string }>,
  constraints: ShiftAbTestConstraint[],
): { valid: boolean; issues: string[] } => {
  const issues: string[] = [];

  constraints.forEach((constraint) => {
    const match = rows.find(
      (row) =>
        row.date === formatDate(constraint.date) &&
        row.shiftType === constraint.shiftType,
    );

    switch (constraint.type) {
      case "MUST":
        if (!match || match.userId !== constraint.userId) {
          issues.push(
            `משתמש ${constraint.userName} חייב לקבל משמרת ${constraint.shiftType} ב-${formatDate(
              constraint.date,
            )}`,
          );
        }
        break;
      case "CANNOT":
        if (match?.userId === constraint.userId) {
          issues.push(
            `משתמש ${constraint.userName} לא יכול להיות ב-${constraint.shiftType} ב-${formatDate(
              constraint.date,
            )}`,
          );
        }
        break;
      case "PREFER":
        if (!match || match.userId !== constraint.userId) {
          issues.push(
            `משתמש ${constraint.userName} הועדף למשמרת ${constraint.shiftType} ב-${formatDate(
              constraint.date,
            )}`,
          );
        }
        break;
      case "PREFER_NOT":
        if (match?.userId === constraint.userId) {
          issues.push(
            `משתמש ${constraint.userName} הועדף שלא להיות ב-${constraint.shiftType} ב-${formatDate(
              constraint.date,
            )}`,
          );
        }
        break;
    }
  });

  return { valid: issues.length === 0, issues };
};

const ShiftAbTest = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState(
    shiftAbTestScenarios[0].id,
  );
  const scenario = useMemo(
    () =>
      shiftAbTestScenarios.find((item) => item.id === selectedScenarioId) ??
      shiftAbTestScenarios[0],
    [selectedScenarioId],
  );

  const [manualStart, setManualStart] = useState<number | null>(null);
  const [manualTimeSeconds, setManualTimeSeconds] = useState<number | null>(
    null,
  );
  const [manualDone, setManualDone] = useState(false);
  const [manualIssues, setManualIssues] = useState<string[]>([]);
  const [algorithmTimeSeconds, setAlgorithmTimeSeconds] = useState<
    number | null
  >(null);
  const [algorithmResult, setAlgorithmResult] = useState<AlgorithmResultRow[]>(
    [],
  );
  const [algorithmReviewStart, setAlgorithmReviewStart] = useState<
    number | null
  >(null);
  const [algorithmReviewTimeSeconds, setAlgorithmReviewTimeSeconds] = useState<
    number | null
  >(null);
  const [algorithmReviewDone, setAlgorithmReviewDone] = useState(false);
  const [algorithmValidationIssues, setAlgorithmValidationIssues] = useState<
    string[]
  >([]);
  const [algorithmStatus, setAlgorithmStatus] = useState<
    "idle" | "running" | "done" | "error"
  >("idle");
  const [algorithmError, setAlgorithmError] = useState<string>("");

  const [manualShifts, setManualShifts] = useState<ManualShiftRow[]>(() =>
    createRows(shiftAbTestScenarios[0]),
  );

  const [constraintDrawerOpen, setConstraintDrawerOpen] = useState(true);

  useEffect(() => {
    setManualShifts(createRows(scenario));
    setManualStart(null);
    setManualTimeSeconds(null);
    setManualDone(false);
    setManualIssues([]);

    setAlgorithmTimeSeconds(null);
    setAlgorithmResult([]);
    setAlgorithmReviewStart(null);
    setAlgorithmReviewTimeSeconds(null);
    setAlgorithmReviewDone(false);
    setAlgorithmValidationIssues([]);
    setAlgorithmStatus("idle");
    setAlgorithmError("");
  }, [scenario]);

  const availableMembers = scenario.teamMembers.filter(
    (member) => member.isAvailable,
  );

  const handleScenarioChange = (event: SelectChangeEvent<string>) => {
    setSelectedScenarioId(event.target.value as string);
  };

  const handleStartManual = () => {
    setManualStart(Date.now());
    setManualTimeSeconds(null);
    setManualDone(false);
    setManualIssues([]);
  };

  const handleStopManual = () => {
    if (!manualStart) return;
    const elapsed = (Date.now() - manualStart) / 1000;
    setManualTimeSeconds(elapsed);
    setManualStart(null);
  };

  const handleResetManual = () => {
    setManualStart(null);
    setManualTimeSeconds(null);
    setManualDone(false);
    setManualIssues([]);
    setManualShifts(createRows(scenario));
  };

  const handleManualChange = (
    rowIndex: number,
    field: "userId" | "shiftType",
    value: string,
  ) => {
    setManualShifts((current) =>
      current.map((shift) =>
        shift.rowIndex !== rowIndex
          ? shift
          : {
              ...shift,
              [field]: value as ShiftType,
            },
      ),
    );
    setManualDone(false);
  };

  const algorithmUrl = import.meta.env.VITE_ALGORITHM_URL?.trim();

  const handleRunAlgorithm = async () => {
    setAlgorithmStatus("running");
    setAlgorithmError("");
    setAlgorithmReviewStart(null);
    setAlgorithmReviewTimeSeconds(null);
    setAlgorithmReviewDone(false);
    setAlgorithmValidationIssues([]);
    const startTime = performance.now();

    const payload = {
      userIds: availableMembers.map((member) => member.id),
      shiftsDates: scenario.shiftsDates.map(formatDate),
      shiftsType: scenario.shiftsType as AllocateShiftType,
      usersPerShift: scenario.usersPerShift,
      constraints: scenario.constraints.map((constraint) => ({
        userId: constraint.userId,
        type: constraint.type,
        date: constraint.date,
      })),
      prevShifts: [],
    };

    try {
      let responseData: AlgorithmResultRow[] = [];

      if (!algorithmUrl) {
        await new Promise((resolve) => setTimeout(resolve, 900));
        responseData = scenario.shiftsDates.map((date, index) => ({
          id: `${date}-result`,
          date,
          userId: availableMembers[index % availableMembers.length]?.id ?? "",
          shiftType: getDefaultShiftType(scenario.shiftsType),
          rowIndex: index,
        }));
      } else {
        const response = await fetch(algorithmUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(
            `שגיאה בשרת האלגוריתם: ${response.status} ${response.statusText}`,
          );
        }

        const data = await response.json();
        responseData = Array.isArray(data)
          ? data.map((shift: any, index: number) => ({
              id: `${shift.date || index}-result`,
              date: formatDate(shift.date || scenario.shiftsDates[index]),
              userId: shift.userId || shift.user?.id || "",
              shiftType:
                (shift.shiftType as ShiftType) ||
                getDefaultShiftType(scenario.shiftsType),
              rowIndex: index,
            }))
          : [];
      }

      setAlgorithmResult(responseData);
      setAlgorithmTimeSeconds((performance.now() - startTime) / 1000);
      setAlgorithmStatus("done");
      // Automatically start the review timer so the user can immediately edit/fix algorithm results
      setAlgorithmReviewStart(Date.now());
    } catch (error) {
      setAlgorithmStatus("error");
      setAlgorithmError(
        error instanceof Error ? error.message : "אירעה שגיאה לא ידועה",
      );
    }
  };

  const handleAlgorithmChange = (
    rowIndex: number,
    field: "userId" | "shiftType",
    value: string,
  ) => {
    setAlgorithmResult((current) =>
      current.map((shift) =>
        shift.rowIndex !== rowIndex
          ? shift
          : {
              ...shift,
              [field]: value as ShiftType,
            },
      ),
    );
    setAlgorithmReviewDone(false);
  };

  // Review timer is started automatically after running the algorithm.

  const handleResetAlgorithmReview = () => {
    setAlgorithmReviewStart(null);
    setAlgorithmReviewTimeSeconds(null);
    setAlgorithmReviewDone(false);
    setAlgorithmValidationIssues([]);
  };

  const handleManualDone = () => {
    const validation = validateConstraints(manualShifts, scenario.constraints);
    setManualIssues(validation.issues);

    if (!validation.valid) {
      return;
    }

    if (manualStart) {
      setManualTimeSeconds((Date.now() - manualStart) / 1000);
      setManualStart(null);
    }
    setManualDone(true);
  };

  const handleAlgorithmDone = () => {
    const validation = validateConstraints(
      algorithmResult,
      scenario.constraints,
    );
    setAlgorithmValidationIssues(validation.issues);

    if (!validation.valid) {
      return;
    }

    if (algorithmReviewStart) {
      setAlgorithmReviewTimeSeconds((Date.now() - algorithmReviewStart) / 1000);
      setAlgorithmReviewStart(null);
    }
    setAlgorithmReviewDone(true);
  };

  const algorithmLabel = "הרץ את האלגוריתם";

  // algorithmReviewLabel removed — review starts automatically when algorithm finishes

  const combinedAlgorithmTime =
    algorithmTimeSeconds !== null && algorithmReviewTimeSeconds !== null
      ? algorithmTimeSeconds + algorithmReviewTimeSeconds
      : null;

  const summaryRows = useMemo(
    () => [
      {
        label: "זמן ידני",
        value: formatTime(manualTimeSeconds),
      },
      {
        label: "זמן אלגוריתם",
        value: formatTime(algorithmTimeSeconds),
      },
      {
        label: "זמן תיקון אלגוריתם",
        value: formatTime(algorithmReviewTimeSeconds),
      },
      {
        label: "זמן כולל אלגוריתם",
        value: formatTime(combinedAlgorithmTime),
      },
      {
        label: "חיסכון משוער",
        value:
          manualTimeSeconds !== null && combinedAlgorithmTime !== null
            ? `${(manualTimeSeconds - combinedAlgorithmTime).toFixed(1)} שניות`
            : "-",
      },
    ],
    [
      manualTimeSeconds,
      algorithmTimeSeconds,
      algorithmReviewTimeSeconds,
      combinedAlgorithmTime,
    ],
  );

  const isPhone = useMediaQuery(theme.breakpoints.down("md"));

  const manualColumns = useMemo<Column<ManualShiftRow>[]>(
    () => [
      { name: "date", label: "תאריך" },
      {
        name: "userId",
        label: "משתמש",
        format: (_value: string, row: ManualShiftRow) => (
          <FormControl fullWidth>
            <Select
              value={row.userId}
              onChange={(event) =>
                handleManualChange(
                  row.rowIndex,
                  "userId",
                  event.target.value as string,
                )
              }
              displayEmpty
              inputProps={{ "aria-label": "בחר משתמש" }}
            >
              <MenuItem value="">
                <em>בחר משתמש</em>
              </MenuItem>
              {availableMembers.map((member) => (
                <MenuItem key={member.id} value={member.id}>
                  {member.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ),
      },
    ],
    [availableMembers],
  );

  const algorithmColumns = useMemo<Column<AlgorithmResultRow>[]>(
    () => [
      { name: "date", label: "תאריך" },
      {
        name: "userId",
        label: "משתמש",
        format: (_value: string, row: AlgorithmResultRow) => (
          <FormControl fullWidth>
            <Select
              value={row.userId}
              onChange={(event) =>
                handleAlgorithmChange(
                  row.rowIndex,
                  "userId",
                  event.target.value as string,
                )
              }
              displayEmpty
              inputProps={{ "aria-label": "בחר משתמש" }}
            >
              <MenuItem value="">
                <em>בחר משתמש</em>
              </MenuItem>
              {availableMembers.map((member) => (
                <MenuItem key={member.id} value={member.id}>
                  {member.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ),
      },
    ],
    [availableMembers],
  );

  return (
    <Box className={style.container}>
      <Box className={style.header}>
        <Typography variant={isPhone ? "h5" : "h4"} component="h1">
          בדיקת A/B לשיבוץ משמרות
        </Typography>
        <Typography variant="body2" className={style.note}>
          השווה את חוויית השיבוץ האוטומטי לחוויית השיבוץ הידני באותה תבנית.
        </Typography>
      </Box>

      <Box className={style.section}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="scenario-label">תרחיש</InputLabel>
              <Select
                labelId="scenario-label"
                value={selectedScenarioId}
                label="תרחיש"
                onChange={handleScenarioChange}
              >
                {shiftAbTestScenarios.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box className={style.scenarioMeta}>
              <Typography variant="subtitle2">
                {scenario.missionName}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {scenario.teamName}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2">{scenario.description}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Box
              className={style.constraintPanel}
              data-open={constraintDrawerOpen}
            >
              <Box className={style.constraintPanelHeader}>
                <Typography variant="subtitle1">אילוצים בתרחיש</Typography>
                <IconButton
                  size="small"
                  onClick={() => setConstraintDrawerOpen(!constraintDrawerOpen)}
                  sx={{
                    transform: constraintDrawerOpen
                      ? "rotate(0deg)"
                      : "rotate(-180deg)",
                    transition: "transform 0.3s ease",
                  }}
                >
                  <ExpandMoreIcon />
                </IconButton>
              </Box>
              <Box className={style.constraintList}>
                {scenario.constraints.map((constraint, index) => (
                  <Box
                    key={`${constraint.userId}-${index}`}
                    className={style.constraintItem}
                  >
                    <Typography variant="body2" component="span">
                      {constraintTypeLabel[constraint.type]}:{" "}
                      {constraint.userName} - {formatDate(constraint.date)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
          <Box className={style.section}>
            <Box className={style.sectionHeader}>
              <Typography variant="h6">משימה ידנית</Typography>
              <Box className={style.buttonGroup}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleStartManual}
                >
                  התחלת טיימר
                </Button>
                {/* <Button variant="outlined" onClick={handleStopManual}>
                  עצירה
                </Button>
                <Button variant="outlined" onClick={handleResetManual}>
                  אפס
                </Button> */}
                <Tooltip
                  title={
                    manualIssues.length
                      ? manualIssues.join(" \u2022 ")
                      : "הנתונים נבדקים"
                  }
                  arrow
                  placement="top"
                >
                  <span>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleManualDone}
                      disabled={!manualShifts.length}
                    >
                      סיום
                    </Button>
                  </span>
                </Tooltip>
              </Box>
            </Box>
            {/* <Typography variant="body2" className={style.statusLine}>
              זמן משימה ידנית:{" "}
              {formatTime(
                manualStart
                  ? (Date.now() - manualStart) / 1000
                  : manualTimeSeconds,
              )}
              {manualDone ? " (הושלם)" : ""}
            </Typography> */}
            {manualIssues.length > 0 && (
              <Typography
                variant="body2"
                color="error"
                className={style.issueMessage}
              >
                יש עוד בעיות באילוצים. הסר את הבעיות לפני סיום.
              </Typography>
            )}
            <ShiftsTable
              title="טבלת משמרות ידנית"
              columns={manualColumns}
              minimizedColumns={manualColumns}
              rows={manualShifts}
              onNext={() => {}}
              onPrev={() => {}}
            />
          </Box>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Box className={style.section}>
            <Box className={style.sectionHeader}>
              <Typography variant="h6">משימת האלגוריתם</Typography>
              <Box className={style.buttonGroup}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleRunAlgorithm}
                >
                  {algorithmLabel}
                </Button>
                {/* Review timer starts automatically when algorithm finishes; user edits until pressing סיום */}
                {/* <Button
                  variant="outlined"
                  onClick={handleResetAlgorithmReview}
                  disabled={!algorithmResult.length}
                >
                  אפס תיקון
                </Button> */}
                {/* <Tooltip
                  title={
                    algorithmValidationIssues.length
                      ? algorithmValidationIssues.join(" \u2022 ")
                      : "הנתונים נבדקים"
                  }
                  arrow
                  placement="top"
                > */}
                <span>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleAlgorithmDone}
                    disabled={!algorithmResult.length}
                  >
                    סיום
                  </Button>
                </span>
                {/* </Tooltip> */}
              </Box>
            </Box>
            {/* <Typography variant="body2" className={style.statusLine}>
              {algorithmUrl
                ? "האלגוריתם יופעל מול נקודת ה-API שמוגדרת בסביבת הבנייה."
                : "אין כתובת אלגוריתם מוגדרת. תוצג הדגמת תוצאה מקומית."}
            </Typography> */}
            {/* <Typography variant="body2" className={style.statusLine}>
              סטטוס: {algorithmStatus}
            </Typography>
            <Typography variant="body2" className={style.statusLine}>
              זמן ריצה: {formatTime(algorithmTimeSeconds)}
            </Typography>
            <Typography variant="body2" className={style.statusLine}>
              זמן תיקון:{" "}
              {formatTime(
                algorithmReviewStart
                  ? (Date.now() - algorithmReviewStart) / 1000
                  : algorithmReviewTimeSeconds,
              )}
              {algorithmReviewDone ? " (הושלם)" : ""}
            </Typography> */}
            {algorithmValidationIssues.length > 0 && (
              <Typography
                variant="body2"
                color="error"
                className={style.issueMessage}
              >
                יש עוד בעיות באילוצים. המשך לערוך את תוצאות האלגוריתם.
              </Typography>
            )}
            {algorithmError && (
              <Typography variant="body2" color="error">
                {algorithmError}
              </Typography>
            )}
            <ShiftsTable
              title="תוצאות האלגוריתם"
              columns={algorithmColumns}
              minimizedColumns={algorithmColumns}
              rows={algorithmResult}
              onNext={() => {}}
              onPrev={() => {}}
            />
          </Box>
        </Grid>
      </Grid>

      <Box className={style.section}>
        <Typography variant="h6" gutterBottom>
          סיכום זמן
        </Typography>
        <Grid container spacing={1}>
          {summaryRows.map((row) => (
            <Grid item xs={12} md={4} key={row.label}>
              <Box className={style.summaryCard}>
                <Typography variant="body2" color="textSecondary">
                  {row.label}
                </Typography>
                <Typography variant="h6">{row.value}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ShiftAbTest;
