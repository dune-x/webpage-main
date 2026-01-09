"use client";

import { useState, useMemo } from "react";
import { 
    Column, 
    Row, 
    Heading, 
    Text, 
    Badge, 
    Grid,
    Input,
    Icon
} from "@once-ui-system/core";

export default function Courts({ matches }) {
    const slots = useMemo(() => {
        const arr = [];
        let h = 9, m = 0;
        while(h < 22) {
            const timeStr = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;
            arr.push(timeStr);
            m += 30;
            if(m >= 60) { h++; m = 0; }
        }
        return arr;
    }, []);

    const [selectedTimeIdx, setSelectedTimeIdx] = useState(0);
    const selectedTime = slots[selectedTimeIdx];
    const courts = ["Pista 1", "Pista 2", "Pista 3", "Pista 4", "Pista 5", "Pista 6"];

    const currentMatches = useMemo(() => {
        if (!matches) return {};
        const map = {};
        matches.forEach(m => {
            if (m.time_slot === selectedTime && m.court) {
                map[m.court] = m;
            }
        });
        return map;
    }, [matches, selectedTime]);

    // Legacy aesthetics
    const BORDER_FREE = "6px solid #cfd6e6";
    const BORDER_BUSY = "6px solid #0a6";

    return (
        <Column gap="32" paddingBottom="80">
             <Column 
                background="surface" 
                padding="24" 
                radius="l" 
                border="neutral-weak" 
                alignItems="center"
                shadow="l"
                style={{borderTop: '5px solid #0056b3'}}
             >
                <Heading variant="heading-strong-m">🎾 Pistas</Heading>
                <Text variant="body-default-xs" onBackground="neutral-weak" paddingBottom="16">
                    Slider de hora: {selectedTime}
                </Text>
                
                <Input
                    type="range"
                    min={0}
                    max={slots.length - 1}
                    value={selectedTimeIdx}
                    onChange={(e) => setSelectedTimeIdx(Number(e.target.value))}
                    width="100%"
                    style={{ accentColor: '#0056b3', cursor: 'pointer' }}
                />
             </Column>

             <Grid columns="repeat(auto-fit, minmax(220px, 1fr))" gap="12">
                {courts.map(c => {
                    const match = currentMatches[c];
                    const isOccupied = !!match;

                    return (
                        <Column 
                            key={c}
                            padding="16"
                            radius="l"
                            background="surface"
                            shadow="s"
                            gap="8"
                            style={{ 
                                borderLeft: isOccupied ? BORDER_BUSY : BORDER_FREE,
                                borderTop: '1px solid #e7e7e7',
                                borderRight: '1px solid #e7e7e7',
                                borderBottom: '1px solid #e7e7e7'
                            }}
                        >
                            <Row justifyContent="space-between" alignItems="center">
                                <Heading variant="heading-strong-s">{c}</Heading>
                                {isOccupied && <Icon name="check" size="s" style={{color:'#0a6'}} />}
                            </Row>

                            {isOccupied ? (
                                <Column gap="4">
                                    <Text variant="body-default-xs" onBackground="neutral-weak">
                                        {match.group ? `Grupo ${match.group}` : "Eliminatoria"}
                                    </Text>
                                    <Text variant="body-default-s" weight="strong">
                                        {match.player1_name || "TBD"} vs {match.player2_name || "TBD"}
                                    </Text>
                                    <Badge size="s" style={{backgroundColor: '#d4edda', color: '#155724'}}>
                                        OCUPADA
                                    </Badge>
                                </Column>
                            ) : (
                                <Column paddingY="24" alignItems="center" opacity="30">
                                    <Text variant="body-default-s" onBackground="neutral-weak">Libre</Text>
                                </Column>
                            )}
                        </Column>
                    )
                })}
             </Grid>
        </Column>
    );
}
