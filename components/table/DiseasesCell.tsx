import React from 'react'

interface DiseasesCellProps {
    diseases?: string[]
}

export function DiseasesCell({ diseases }: DiseasesCellProps) {
    if (!diseases?.length) {
        return <span className="text-muted-foreground italic">No diseases listed</span>
    }

    if (diseases.length > 1) {
        return (
            <ul className="list-inside list-disc space-y-1">
                {diseases.map((disease, i) => (
                    <li key={i} className="capitalize">
                        {disease}
                    </li>
                ))}
            </ul>
        )
    }

    return <div className="capitalize">{diseases[0]}</div>
}
