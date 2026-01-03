'use client';

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import styles from "./page.module.css";
import { getCases } from "@/lib/api";
import { Case } from "@/types";
import { useEffect, useState } from "react";
import { Search, Filter, AlertCircle } from "lucide-react";
import { NewCaseModal } from "@/components/cases/NewCaseModal";
import { CaseDetailsModal } from "@/components/cases/CaseDetailsModal";

export default function CasesPage() {
    const [cases, setCases] = useState<Case[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCase, setSelectedCase] = useState<Case | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    // Search and Filter State
    const [searchQuery, setSearchQuery] = useState("");
    const [showActiveOnly, setShowActiveOnly] = useState(false);

    useEffect(() => {
        getCases().then(data => {
            setCases(data);
            setIsLoading(false);
        });
    }, []);

    const handleViewCase = (c: Case) => {
        setSelectedCase(c);
        setIsDetailsOpen(true);
    };

    const filteredCases = cases.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.id.toString().includes(searchQuery);
        const matchesFilter = showActiveOnly ? c.status !== 'RESOLVED' : true;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.searchBar}>
                    <Input
                        placeholder="Search cases..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button variant="secondary" className={styles.iconBtn}>
                        <Search size={20} />
                    </Button>
                </div>
                <Button
                    variant={showActiveOnly ? "primary" : "secondary"}
                    className={styles.filterBtn}
                    onClick={() => setShowActiveOnly(!showActiveOnly)}
                >
                    <Filter size={18} />
                    {showActiveOnly ? "Active Only" : "All Cases"}
                </Button>
                <Button onClick={() => setIsModalOpen(true)}>New Case</Button>
            </div>

            <div className={styles.caseList}>
                {isLoading ? (
                    <p>Loading cases...</p>
                ) : filteredCases.length === 0 ? (
                    <p>No cases found matching your criteria.</p>
                ) : filteredCases.map((c) => (
                    <Card key={c.id} className={styles.caseItem}>
                        <div className={styles.caseIcon} data-severity={c.severity}>
                            <AlertCircle size={24} />
                        </div>
                        <div className={styles.caseInfo}>
                            <div className={styles.caseHeader}>
                                <h3>{c.title}</h3>
                                <span className={styles.caseId}>#{c.id}</span>
                            </div>
                            <p className={styles.caseDesc}>{c.description}</p>
                            <div className={styles.caseMeta}>
                                <span className={styles.badge} data-status={c.status}>{c.status}</span>
                                <span className={styles.date}>{new Date(c.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className={styles.actions}>
                            <Button size="sm" variant="secondary" onClick={() => handleViewCase(c)}>View</Button>
                        </div>
                    </Card>
                ))}
            </div>

            <NewCaseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <CaseDetailsModal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                caseData={selectedCase}
            />
        </div>
    );
}
