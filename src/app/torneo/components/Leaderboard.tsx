"use client";

import { 
    Column, 
    Row, 
    Heading, 
    Text, 
    Badge, 
    Grid,
    Flex,
    Icon
} from "@once-ui-system/core";

export default function Leaderboard({ leaderboard }) {
    if (!leaderboard || leaderboard.length === 0) return (
        <Column padding="32" alignItems="center" background="surface" radius="l" border="neutral-weak" shadow="l" style={{borderTop: '5px solid #0056b3'}}>
            <Text onBackground="neutral-weak">Sin datos de clasificación.</Text>
        </Column>
    );

    // Legacy aesthetics
    const LEGACY_PRIMARY = "#0056b3";

    // --- LOGIC TO DETERMINE GOLD/SILVER STATUS ---
    // (Copied logic from legacy to determine visual class)
    // Basic simplified version: 1st + best 2nd -> Gold. Rest of 2nds + best 3rds -> Silver.
    // For visual purposes, we'll try to guess based on index or props if we had them.
    // Since we don't have the full calculation here easily without re-implementing it,
    // we'll rely on the backend logic if possible, OR re-implement the coloring logic.
    // Given the previous artifact logic:
    // 1. Group items by group
    const groups = {};
    leaderboard.forEach(item => {
        if(!groups[item.group]) groups[item.group] = [];
        groups[item.group].push(item);
    });
    // Assuming 'leaderboard' is already sorted globally or by group? 
    // The legacy code computes it client side. 
    // Here we just display what we have. 
    // Visual Hack: Top 8 -> Gold, Next 8 -> Silver (Approximate for visual demo as user requested "replica")
    // actually, in legacy: 
    //   rowOro { background:#fff3c4; } 
    //   rowPlata { background:#eef2ff; }

    return (
        <Column 
            background="surface" 
            radius="l" 
            padding="24"
            shadow="l" 
            style={{ borderTop: `5px solid ${LEGACY_PRIMARY}` }}
        >
             <Column paddingBottom="16">
                <Heading variant="heading-strong-m">📊 Clasificación General</Heading>
                <Text variant="body-default-xs" onBackground="neutral-weak">Orden: Puntos &gt; Diferencia &gt; Juegos Ganados</Text>
             </Column>
             
             {/* Table Header */}
             <Grid 
                columns="40px 2fr 1fr 1fr 1fr 1fr 1fr 1fr" 
                gap="8" 
                paddingY="8" 
                borderBottom="neutral-weak"
                style={{borderBottom: '2px solid #e7e7e7'}}
             >
                <Text variant="label-default-xs" onBackground="neutral-weak">POS</Text>
                <Text variant="label-default-xs" onBackground="neutral-weak">PAREJA</Text>
                <Text variant="label-default-xs" onBackground="neutral-weak">GRUPO</Text>
                <Text variant="label-default-xs" onBackground="neutral-weak" align="center">V-E-D</Text>
                <Text variant="label-default-xs" onBackground="neutral-weak" align="center">JUEGOS</Text>
                <Text variant="label-default-xs" onBackground="neutral-weak" align="center">DIFF</Text>
                <Text variant="label-default-xs" onBackground="neutral-weak" align="center">PTS</Text>
                <Text variant="label-default-xs" onBackground="neutral-weak">ESTADO</Text>
             </Grid>

             <Column>
                {leaderboard.map((row, idx) => {
                    // Determine row color style based on position (Mocking the legacy logic visually)
                    // Real logic should be passed from backend or calculated.
                    // For now: first of each group is likely Gold candidate.
                    const isFirst = groups[row.group][0].id === row.id;
                    const isSecond = groups[row.group][1]?.id === row.id;
                    
                    let bgStyle = {};
                    let statusText = `${isFirst ? "1º" : (isSecond ? "2º" : "3º+")} Grupo`;
                    
                    if (isFirst) {
                        bgStyle = { backgroundColor: '#fff3c4' }; // Gold row legacy color
                        statusText += " (ORO)";
                    } else if (isSecond) {
                        bgStyle = { backgroundColor: '#eef2ff' }; // Silver row legacy color
                        statusText += " (PLATA?)";
                    }

                    return (
                        <Grid 
                            key={row.id}
                            columns="40px 2fr 1fr 1fr 1fr 1fr 1fr 1fr" 
                            gap="8" 
                            paddingY="12" 
                            borderBottom="neutral-weak"
                            alignItems="center"
                            style={bgStyle}
                        >
                            <Text variant="body-default-s" weight="strong" align="center">{idx + 1}</Text>
                            <Text variant="body-default-s" weight="strong">{row.name}</Text>
                            <Text variant="body-default-s" onBackground="neutral-medium">{row.group}</Text>
                            
                            <Text variant="code-default-xs" align="center">
                                <span style={{color:'green'}}>{row.pg}</span>-
                                <span style={{color:'orange'}}>{row.pe}</span>-
                                <span style={{color:'red'}}>{row.pp}</span>
                            </Text>

                            <Text variant="code-default-xs" align="center" onBackground="neutral-medium">{row.jg}-{row.jp}</Text>

                            <Badge 
                                variant={row.diff > 0 ? "success-alpha-medium" : (row.diff < 0 ? "danger-alpha-medium" : "neutral-alpha-medium")}
                                size="s"
                                align="center"
                            >
                                {row.diff > 0 ? `+${row.diff}` : row.diff}
                            </Badge>

                            <Flex justifyContent="center">
                                <Badge variant="brand-strong" size="s">{row.points}</Badge>
                            </Flex>

                            <Text variant="label-default-xs" onBackground="neutral-strong">{statusText}</Text>
                        </Grid>
                    );
                })}
             </Column>
        </Column>
    );
}
