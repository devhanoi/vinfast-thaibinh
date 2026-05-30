"use client";

import { FaqEntity, type FaqEntityT } from "@/lib/zod";
import { ResourceList } from "../../_components/resource-list";

export default function AdminFaqsPage() {
  return (
    <ResourceList<FaqEntityT>
      title="FAQ"
      description="Câu hỏi thường gặp hiển thị ở landing + FAQPage JSON-LD."
      endpoint="/api/admin/faqs"
      schema={FaqEntity}
      columns={[
        { key: "question", label: "Câu hỏi", cell: (f) => <span className="font-semibold text-ink">{f.question}</span> },
        { key: "answer", label: "Trả lời", cell: (f) => <span className="line-clamp-2 text-ink-muted">{f.answer}</span> },
        { key: "sortOrder", label: "Thứ tự", cell: (f) => f.sortOrder },
        {
          key: "active",
          label: "Active",
          cell: (f) =>
            f.isActive ? (
              <span className="text-brand">●</span>
            ) : (
              <span className="text-ink-muted">○</span>
            ),
        },
      ]}
    />
  );
}
