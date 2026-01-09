"use client";

import { useState } from "react";
import { 
    Grid, 
    Column, 
    Row, 
    Heading, 
    Text, 
    Badge, 
    Button, 
    Input,
    Flex,
    Icon
} from "@once-ui-system/core";

export default function GroupsView({ participants, matches, onMatchUpdate }) {
  const groups = participants.reduce((acc, p) => {
    if (!acc[p.group]) acc[p.group] = [];
    acc[p.group].push(p);
    return acc;
  }, {});

  const matchesByGroup = matches.reduce((acc, m) => {
    if (!acc[m.group]) acc[m.group] = [];
    acc[m.group].push(m);
    return acc;
  }, {});

  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(null);

  const handleScoreChange = (matchId, player, value) => {
    setScores(prev => ({
        ...prev,
        [matchId]: {
            ...prev[matchId],
            [player]: parseInt(value) || 0
        }
    }));
  };

  const saveScore = async (match) => {
      const s = scores[match.id];
      if(!s) return;
      setLoading(match.id);
      await onMatchUpdate(match.id, s.p1 ?? match.score_p1, s.p2 ?? match.score_p2);
      setLoading(null);
      setScores(prev => {
          const newState = {...prev};
          delete newState[match.id];
          return newState;
      });
  }

  // Legacy aesthetics map
  const LEGACY_PRIMARY = "#0056b3"; // Blue

  return (
    <Grid columns="repeat(auto-fit, minmax(350px, 1fr))" gap="12" paddingBottom="80">
      {Object.keys(groups).sort().map(g => (
        <Column 
            key={g} 
            background="surface" 
            radius="l" 
            padding="16"
            shadow="l"
            style={{ borderTop: `5px solid ${LEGACY_PRIMARY}` }}
            gap="16"
        >
          {/* Header */}
          <Row justifyContent="space-between" alignItems="center">
            <Column>
                <Heading variant="heading-strong-m" style={{color: LEGACY_PRIMARY}}>GRUPO {g}</Heading>
                <Text variant="body-default-xs" onBackground="neutral-weak">
                    {groups[g].map(p=>p.name).join(" · ")}
                </Text>
            </Column>
            <Badge variant="neutral-medium" size="s">
                {groups[g].length} parejas
            </Badge>
          </Row>

          {/* Matches Table-like structure */}
          <Column gap="8">
             {/* Header Row */}
             <Row gap="8" paddingBottom="4" borderBottom="neutral-weak">
                 <Text variant="label-default-xs" onBackground="neutral-weak" flex={5}>PARTIDO</Text>
                 <Text variant="label-default-xs" onBackground="neutral-weak" flex={3}>HORA / PISTA</Text>
                 <Text variant="label-default-xs" onBackground="neutral-weak" flex={2} align="right">RESULTADO</Text>
             </Row>

            {matchesByGroup[g]?.map(m => {
                 const p1 = participants.find(p=>p.id===m.player1_id);
                 const p2 = participants.find(p=>p.id===m.player2_id);
                 const s = scores[m.id] || {};
                 const val1 = s.p1 ?? m.score_p1;
                 const val2 = s.p2 ?? m.score_p2;
                 const isDirty = s.p1 !== undefined || s.p2 !== undefined;
                 
                 const p1Won = m.score_p1 > m.score_p2;
                 const p2Won = m.score_p2 > m.score_p1;

                 return (
                <Row 
                    key={m.id} 
                    alignItems="center" 
                    gap="8" 
                    paddingY="8" 
                    borderBottom="neutral-weak"
                >
                    {/* Players */}
                    <Column flex={5} gap="4">
                        <Text variant="body-default-s" weight="strong">
                            {p1?.name || "J1"} <Text as="span" variant="body-default-xs" onBackground="neutral-weak">vs</Text> {p2?.name || "J2"}
                        </Text>
                        {isDirty && (
                            <Button 
                                onClick={()=>saveScore(m)} 
                                loading={loading === m.id}
                                variant="primary"
                                size="s"
                            >
                                Guardar
                            </Button>
                        )}
                    </Column>

                    {/* Time/Court Chips */}
                    <Column flex={3} gap="4">
                        <Badge variant="neutral-alpha-medium" size="s" icon="time">
                            {m.time_slot || "--:--"}
                        </Badge>
                        <Badge variant="info-alpha-medium" size="s">
                            {m.court || "S/A"}
                        </Badge>
                    </Column>

                    {/* Score Inputs (Legacy Box Style) */}
                    <Row flex={2} justifyContent="flex-end" alignItems="center" gap="4">
                         <Input
                            id={`score-${m.id}-p1`}
                            label=""
                            type="number"
                            min={0}
                            value={val1}
                            onChange={(e)=>handleScoreChange(m.id, 'p1', e.target.value)}
                            width="2.5rem"
                            align="center"
                            style={{ 
                                backgroundColor: p1Won ? 'var(--success-alpha-weak)' : 'white',
                                borderColor: p1Won ? 'var(--success-medium)' : 'var(--neutral-weak)',
                                fontWeight: 'bold'
                            }}
                        />
                         <Text variant="body-default-s">-</Text>
                         <Input
                            id={`score-${m.id}-p2`}
                            label=""
                            type="number"
                            min={0}
                            value={val2}
                            onChange={(e)=>handleScoreChange(m.id, 'p2', e.target.value)}
                            width="2.5rem"
                            align="center"
                            style={{ 
                                backgroundColor: p2Won ? 'var(--success-alpha-weak)' : 'white',
                                borderColor: p2Won ? 'var(--success-medium)' : 'var(--neutral-weak)',
                                fontWeight: 'bold'
                            }}
                         />
                    </Row>
                </Row>
            )})}
          </Column>
        </Column>
      ))}
    </Grid>
  );
}
