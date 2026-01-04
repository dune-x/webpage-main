"use client";

import React, { useState, useEffect, type FC } from "react";
import {
  Column,
  Row,
  Heading,
  Text,
  Button,
  Badge,
  RevealFx,
  Line,
} from "@once-ui-system/core";

const API_URL = "https://script.google.com/macros/s/AKfycbwn6FevKGZhNK5hY3TwVwOk_y4XflQFJ1kmNCIFGzRWa8GglmTihWl63h3ZE_TjeRJFzg/exec";

interface Participant {
  id: number;
  group: string;
  player1: string;
  player2: string;
}

interface Match {
  id: string;
  group: string;
  time: string;
  courtLetter: string;
  court?: string;
  teamA: string;
  teamB: string;
}

interface LeaderboardEntry {
  name: string;
  score: number;
  points_scored: number;
  points_conceded: number;
}

interface BracketTeam {
  name: string;
}

interface TournamentData {
  participants: Participant[];
  schedule: Match[];
  leaderboard: Record<string, LeaderboardEntry[]>;
  brackets: {
    oro: BracketTeam[];
    plata: BracketTeam[];
  };
  results?: Record<string, { scoreA: number; scoreB: number }>;
}

const TorneoDashboard: FC = () => {
  const [activeTab, setActiveTab] = useState("schedule");
  const [data, setData] = useState<TournamentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch raw data from Google Sheets
      const response = await fetch(API_URL, { cache: "no-store", method: "GET" });
      const rawData = await response.json();
      
      if (rawData) {
        // 2. Process data with Python Engine
        const calcResponse = await fetch("/api/torneo/calculate", {
             method: "POST",
             body: JSON.stringify(rawData),
             headers: { "Content-Type": "application/json" }
        });
        
        if (calcResponse.ok) {
            const processedData = await calcResponse.json();
            console.log("Python Data:", processedData); // Debug
            setData(processedData);
        } else {
             console.error("Calculation failed", await calcResponse.text());
             // Fallback to raw data if needed, but structure might mismatch
             setData(rawData); 
        }
      }
    } catch (error) {
      console.error("Error fetching tournament data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMatchesForGroup = (group: string): Match[] => {
    if (!data?.schedule) return [];
    return data.schedule.filter(m => m.group === group);
  };

  const getScoreForMatch = (id: string) => {
    const res = data?.results?.[id];
    return {
      scoreA: res?.scoreA ?? 0,
      scoreB: res?.scoreB ?? 0
    };
  };

  if (loading) {
    return (
      <Column fillWidth horizontal="center" padding="xl">
        <Text variant="body-default-s" onBackground="neutral-weak">Cargando datos del torneo...</Text>
      </Column>
    );
  }

  const participants = data?.participants || [];

  return (
    <Column fillWidth gap="xl" padding="m">
      <RevealFx fillWidth horizontal="center">
        <Column align="center" gap="s">
          <Heading variant="display-strong-m">Torneo Pádel DUNE-X</Heading>
          <Text variant="body-default-m" onBackground="neutral-weak">Gestión y Clasificación en Tiempo Real</Text>
        </Column>
      </RevealFx>

      <Row fillWidth horizontal="center" gap="s" marginBottom="m" style={{ flexWrap: "wrap" }}>
        {[
          { id: "schedule", label: "Grupos" },
          { id: "leaderboard", label: "Clasificación" },
          { id: "finals", label: "Eliminatorias" },
          { id: "courts", label: "Pistas" }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "primary" : "tertiary"}
            size="s"
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </Row>

      <Column fillWidth gap="m">
        {activeTab === "schedule" && (
          <RevealFx fillWidth>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "24px",
              width: "100%"
            }}>
              {Object.entries(groupParticipants(participants)).map(([group, members]) => (
                <Column key={group} gap="m" padding="m" style={{ background: "rgba(255,255,255,0.05)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <Row fillWidth horizontal="between" vertical="center">
                    <Heading variant="heading-strong-m">GRUPO {group}</Heading>
                    <Badge background="brand-alpha-weak" onBackground="neutral-strong">{members.length} parejas</Badge>
                  </Row>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    {members.map(m => `${m.player1} & ${m.player2}`).join(" · ")}
                  </Text>
                  
                  <Column gap="xs" marginTop="s">
                    {getMatchesForGroup(group).length > 0 ? (
                        getMatchesForGroup(group).map((m) => (
                          <Row key={m.id} fillWidth vertical="center" horizontal="between" paddingY="8" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                            <Column flex={1}>
                               <Text variant="body-default-s"><b>{m.teamA}</b> <Text onBackground="neutral-weak">vs</Text> <b>{m.teamB}</b></Text>
                               <Row gap="8" marginTop="4">
                                 <Badge background="neutral-alpha-weak" onBackground="neutral-weak">🕒 {m.time}</Badge>
                                 <Badge background="neutral-alpha-weak" onBackground="neutral-weak">🎾 Pista {m.courtLetter}</Badge>
                               </Row>
                            </Column>
                            <Row gap="4">
                               <Badge background="brand-alpha-strong" onBackground="neutral-strong">
                                 {getScoreForMatch(m.id).scoreA} - {getScoreForMatch(m.id).scoreB}
                               </Badge>
                            </Row>
                          </Row>
                        ))
                    ) : (
                        <Text variant="body-default-s" onBackground="neutral-weak">Sin partidos programados.</Text>
                    )}
                  </Column>
                </Column>
              ))}
            </div>
          </RevealFx>
        )}
        
        {activeTab === "leaderboard" && (
          <RevealFx fillWidth>
            <Column gap="m">
              {/* Leaderboard Grid */}
              <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                  gap: "24px",
                  width: "100%"
                }}>
                {Object.entries(data?.leaderboard || {}).map(([group, rows]) => (
                    <Column key={group} gap="s" padding="m" style={{ background: "rgba(255,255,255,0.05)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <Heading variant="heading-strong-s">Clasificación Grupo {group}</Heading>
                         <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                            <thead>
                              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                                <th style={{ padding: "8px" }}><Text variant="label-default-s" onBackground="neutral-weak">Pareja</Text></th>
                                <th style={{ padding: "8px" }}><Text variant="label-default-s" onBackground="neutral-weak">Pts</Text></th>
                                <th style={{ padding: "8px" }}><Text variant="label-default-s" onBackground="neutral-weak">Dif</Text></th>
                              </tr>
                            </thead>
                            <tbody>
                                {rows.map((r, idx) => (
                                    <tr key={`${r.name}-${idx}`} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                        <td style={{ padding: "8px" }}><Text variant="body-default-s">{r.name}</Text></td>
                                        <td style={{ padding: "8px" }}><Text variant="body-default-s"><b>{r.score}</b></Text></td>
                                        <td style={{ padding: "8px" }}><Text variant="body-default-s" onBackground="neutral-weak">{r.points_scored - r.points_conceded}</Text></td>
                                    </tr>
                                ))}
                            </tbody>
                         </table>
                    </Column>
                ))}
              </div>
            </Column>
          </RevealFx>
        )}
        
        {activeTab === "finals" && (
          <RevealFx fillWidth>
               <Column gap="l">
                 {/* ORO Bracket */}
                 {data?.brackets?.oro && data.brackets.oro.length > 0 && (
                     <Column gap="m" padding="m" style={{ background: "rgba(255,215,0,0.1)", borderRadius: "16px", border: "1px solid rgba(255,215,0,0.2)" }}>
                        <Heading variant="heading-strong-m" style={{ color: "gold" }}>🏆 FASE ORO</Heading>
                        <Text variant="body-default-s">Clasificados: {data.brackets.oro.map(t => t.name).join(", ")}</Text>
                     </Column>
                 )}
                 {/* PLATA Bracket */}
                 {data?.brackets?.plata && data.brackets.plata.length > 0 && (
                     <Column gap="m" padding="m" style={{ background: "rgba(192,192,192,0.1)", borderRadius: "16px", border: "1px solid rgba(192,192,192,0.2)" }}>
                        <Heading variant="heading-strong-m" style={{ color: "silver" }}>🥈 FASE PLATA</Heading>
                        <Text variant="body-default-s">Clasificados: {data.brackets.plata.map(t => t.name).join(", ")}</Text>
                     </Column>
                 )}
                 {(!data?.brackets || (data.brackets.oro.length === 0 && data.brackets.plata.length === 0)) && (
                    <Text variant="body-default-s" onBackground="neutral-weak" padding="m">No se han generado cuadros todavía.</Text>
                 )}
               </Column>
          </RevealFx>
        )}
        
        {activeTab === "courts" && (
          <RevealFx fillWidth>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              width: "100%"
            }}>
                {/* Visualizing Courts - simplified based on schedule */}
                {[...new Set(data?.schedule?.map(m => m.court).filter((c): c is string => !!c))].sort().map((court) => (
                     <Column key={court} padding="m" gap="s" style={{ background: "rgba(255,255,255,0.05)", borderRadius: "12px" }}>
                         <Heading variant="heading-strong-s">Pista {court}</Heading>
                         <Text variant="body-default-s" onBackground="neutral-weak">
                            {data?.schedule.filter(m => m.court === court).length} partidos programados
                         </Text>
                     </Column>
                ))}
                {(!data?.schedule || data.schedule.length === 0) && (
                     <Text variant="body-default-s" onBackground="neutral-weak">No hay información de pistas.</Text>
                )}
            </div>
          </RevealFx>
        )}
      </Column>

      <Line marginY="32" />
      
      <Row fillWidth horizontal="center" gap="m">
        <Button variant="tertiary" size="s" onClick={fetchData}>Recargar Servidor</Button>
      </Row>
    </Column>
  );
};

// Helper functions
const groupParticipants = (participants: Participant[]) => {
  return participants.reduce((acc, p) => {
    const group = p.group;
    if (!acc[group]) acc[group] = [];
    acc[group].push(p);
    return acc;
  }, {} as Record<string, Participant[]>);
};

const getMatchesForGroup = (group: string) => {
  // Logic will be implemented to filter data.schedule
  console.log("Filtering matches for group:", group);
  return []; 
};

const getScoreForMatch = (id: string) => ({ scoreA: 0, scoreB: 0 });

export default TorneoDashboard;
