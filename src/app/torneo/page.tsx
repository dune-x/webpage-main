"use client";

import { useEffect, useState } from "react";
import "./legacy.css"; // Import legacy aesthetics
import { 
    Column, 
    Row, 
    Heading, 
    Text, 
    Button, 
    Flex, 
    Spinner, 
    ToggleButton,
    Icon,
    Background
} from "@once-ui-system/core";

import GroupsView from "./components/GroupsView";
import Leaderboard from "./components/Leaderboard";
import Brackets from "./components/Brackets";
import Courts from "./components/Courts";

const API_BASE = "http://localhost:8000/api";

export default function TorneoPage() {
    const [activeTab, setActiveTab] = useState("groups");
    const [state, setState] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchState = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/state`);
            if (!res.ok) throw new Error("Error fetching state");
            const data = await res.json();
            setState(data);
            setLoading(false);
        } catch (e) {
            console.error(e);
            setError(e.message);
            setLoading(false);
        }
    };

    const handleInit = async () => {
        if (!confirm("Esto borrará los datos actuales y recargará desde Google Sheets. ¿Continuar?")) return;
        try {
            const res = await fetch(`${API_BASE}/init`, { method: "POST" });
            if (!res.ok) throw new Error("Error init");
            fetchState();
        } catch (e) {
            alert(e.message);
        }
    }

    const handleMatchUpdate = async (matchId, sA, sB) => {
        try {
            const res = await fetch(`${API_BASE}/match/update`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ match_id: matchId, scoreA: sA, scoreB: sB })
            });
            if (res.ok) fetchState();
        } catch (e) {
            alert("Error updating match");
        }
    }

    useEffect(() => {
        fetchState();
    }, []);

    if (loading) return (
        <Flex fillWidth fillHeight alignItems="center" justifyContent="center" padding="32">
            <Column alignItems="center" gap="16">
                <Spinner size="l" />
                <Text variant="body-default-m" onBackground="neutral-weak">Cargando torneo...</Text>
            </Column>
        </Flex>
    );

    if (error) return (
        <Flex fillWidth fillHeight alignItems="center" justifyContent="center" padding="32">
            <Column alignItems="center" gap="16">
                <Icon name="error" size="l" onBackground="danger-medium"/>
                <Text variant="body-default-l" onBackground="danger-medium">Error: {error}</Text>
                <Text variant="body-default-s" onBackground="neutral-weak">Asegúrate de ejecutar: python backend/main.py</Text>
                <Button onClick={fetchState} variant="secondary">Reintentar</Button>
            </Column>
        </Flex>
    );

    const tabs = [
        { label: "Grupos", value: "groups" },
        { label: "Clasificación", value: "leaderboard" },
        { label: "Eliminatorias", value: "brackets" },
        { label: "Pistas", value: "courts" }
    ];

    return (
        <Column fillWidth paddingY="80" paddingX="s" alignItems="center" gap="32">
            {/* Header Card Legacy Style */}
            <Column 
                fillWidth 
                maxWidth="l" 
                gap="24" 
                padding="24"
                radius="l"
                background="surface"
                shadow="l"
                style={{ 
                    borderTop: '5px solid #0056b3',
                    backdropFilter: 'blur(12px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)'
                }}
            >
                <Row fillWidth justifyContent="space-between" alignItems="center" gap="16" mobileDirection="column">
                    <Column gap="4">
                        <Heading variant="display-strong-s" style={{color: '#0056b3'}}>Torneo Padel Dune-X</Heading>
                        <Text variant="body-default-s" onBackground="neutral-weak">Gestión de partidos y resultados en tiempo real</Text>
                    </Column>
                    <Row gap="8">
                        <Button onClick={fetchState} variant="secondary" size="s" prefixIcon="refresh">
                            Refrescar
                        </Button>
                        <Button onClick={handleInit} variant="primary" size="s" prefixIcon="cloudDownload">
                            Recargar Sheets
                        </Button>
                    </Row>
                </Row>

                <Row fillWidth justifyContent="center" paddingBottom="4">
                    <ToggleButton 
                        options={tabs}
                        selected={activeTab}
                        onToggle={(val) => setActiveTab(val)}
                        width="fit"
                    />
                </Row>
            </Column>

            <Column fillWidth maxWidth="l">
                {activeTab === "groups" && (
                    <GroupsView 
                        participants={state.participants} 
                        matches={state.matches} 
                        onMatchUpdate={handleMatchUpdate} 
                    />
                )}
                {activeTab === "leaderboard" && (
                    <Leaderboard leaderboard={state.leaderboard} />
                )}
                {activeTab === "brackets" && (
                    <Brackets brackets={state.brackets} />
                )}
                {activeTab === "courts" && (
                    <Courts matches={state.matches} />
                )}
            </Column>
        </Column>
    );
}
