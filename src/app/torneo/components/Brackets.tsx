"use client";

import { 
    Column, 
    Row, 
    Heading, 
    Text, 
    Badge, 
    Grid,
} from "@once-ui-system/core";

export default function Brackets({ brackets }) {
    if (!brackets) return null;

    const renderBracket = (title, nodes, colorVariant="brand") => {
        if (!nodes || nodes.length === 0) return null;

        // Group by round
        const rounds = {};
        nodes.forEach(n => {
            if (!rounds[n.round]) rounds[n.round] = [];
            rounds[n.round].push(n);
        });

        const roundKeys = Object.keys(rounds).sort((a,b) => parseInt(a) - parseInt(b));

        return (
            <Column paddingBottom="48" gap="24">
                 <Row gap="12" alignItems="center">
                    <Heading variant="heading-strong-m">
                        {title}
                    </Heading>
                    <Badge variant={colorVariant === "gold" ? "warning-medium" : "neutral-medium"}>
                        {colorVariant === "gold" ? "🏆 Oro" : "🥈 Plata"}
                    </Badge>
                 </Row>
                 
                 <Row gap="32" overflowX="auto" paddingBottom="16">
                    {roundKeys.map(r => (
                        <Column key={r} gap="32" minWidth="240px">
                            <Text variant="label-default-s" align="center" onBackground="neutral-weak" weight="strong">
                                {Number(r) === 3 ? "CUARTOS" : (Number(r) === 2 ? "SEMIFINAL" : (Number(r) === 1 ? "FINAL" : `RONDA ${r}`))}
                            </Text>
                            
                            <Column gap="16" flex={1} justifyContent="center">
                                {rounds[r].map(match => (
                                    <Column 
                                        key={match.id} 
                                        background="surface" 
                                        border="neutral-weak" 
                                        radius="m" 
                                        padding="16"
                                        gap="8"
                                        shadow="s"
                                    >
                                        <Row justifyContent="space-between" alignItems="center">
                                            <Text variant="body-default-s" weight={match.player1?.advances ? "strong" : "default"}>
                                                {match.player1?.name || "TBD"}
                                            </Text>
                                            <Badge variant={match.player1?.advances ? "success-medium" : "neutral-alpha-medium"} size="s">
                                                {match.score_p1 ?? "-"}
                                            </Badge>
                                        </Row>
                                        
                                        <Row justifyContent="space-between" alignItems="center">
                                            <Text variant="body-default-s" weight={match.player2?.advances ? "strong" : "default"}>
                                                 {match.player2?.name || "TBD"}
                                            </Text>
                                            <Badge variant={match.player2?.advances ? "success-medium" : "neutral-alpha-medium"} size="s">
                                                 {match.score_p2 ?? "-"}
                                            </Badge>
                                        </Row>

                                        {(match.court || match.time_slot) && (
                                            <Row gap="8" paddingTop="8" borderTop="neutral-weak">
                                                {match.time_slot && <Text variant="label-default-xs" onBackground="neutral-weak">{match.time_slot}</Text>}
                                                {match.court && <Badge variant="info-alpha-medium" size="s">{match.court}</Badge>}
                                            </Row>
                                        )}
                                    </Column>
                                ))}
                            </Column>
                        </Column>
                    ))}
                 </Row>
            </Column>
        );
    };

    return (
        <Column gap="48">
            {renderBracket("Fase Oro", brackets.Gold, "gold")}
            {renderBracket("Fase Plata", brackets.Silver, "silver")}
        </Column>
    );
}
