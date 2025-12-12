"use client";

import { useState } from "react";
import type { VisaPathway } from "@/types";
import { cn } from "@/lib/utils";
import {
  formatCurrency,
  formatProcessingTime,
  formatPercentage,
  getScoreColor,
} from "@/lib/utils/formatters";

interface PathwayComparisonProps {
  pathways: VisaPathway[];
}

export function PathwayComparison({ pathways }: PathwayComparisonProps) {
  const [selectedPathways, setSelectedPathways] = useState<string[]>(
    pathways.slice(0, 2).map((p) => p.id)
  );

  const comparedPathways = pathways.filter((p) =>
    selectedPathways.includes(p.id)
  );

  const togglePathway = (id: string) => {
    if (selectedPathways.includes(id)) {
      setSelectedPathways(selectedPathways.filter((p) => p !== id));
    } else if (selectedPathways.length < 3) {
      setSelectedPathways([...selectedPathways, id]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Selection */}
      <div className="flex flex-wrap gap-2">
        {pathways.map((pathway) => (
          <button
            key={pathway.id}
            type="button"
            onClick={() => togglePathway(pathway.id)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              selectedPathways.includes(pathway.id)
                ? "bg-primary text-primary-foreground"
                : "border border-border hover:border-primary/50"
            )}
          >
            {pathway.visaTypes[0]?.name || pathway.id}
          </button>
        ))}
      </div>

      {/* Comparison Table */}
      {comparedPathways.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="p-4 text-left font-medium">Metric</th>
                {comparedPathways.map((pathway) => (
                  <th key={pathway.id} className="p-4 text-center font-medium">
                    {pathway.visaTypes[0]?.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="p-4 font-medium">Eligibility Score</td>
                {comparedPathways.map((p) => (
                  <td key={p.id} className="p-4 text-center">
                    <span
                      className={cn(
                        "text-lg font-bold",
                        getScoreColor(p.eligibilityScore)
                      )}
                    >
                      {formatPercentage(p.eligibilityScore)}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium">Success Probability</td>
                {comparedPathways.map((p) => (
                  <td key={p.id} className="p-4 text-center">
                    <span
                      className={cn(
                        "text-lg font-bold",
                        getScoreColor(p.successProbability)
                      )}
                    >
                      {formatPercentage(p.successProbability)}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium">Processing Time</td>
                {comparedPathways.map((p) => (
                  <td key={p.id} className="p-4 text-center">
                    {formatProcessingTime(p.estimatedProcessingTime)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium">Total Cost</td>
                {comparedPathways.map((p) => (
                  <td key={p.id} className="p-4 text-center font-medium">
                    {formatCurrency(p.totalCost)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium">Risk Factors</td>
                {comparedPathways.map((p) => (
                  <td key={p.id} className="p-4 text-center">
                    <span className="text-orange-500">
                      {p.riskFactors.length} risks
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
