import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ScheduleModal({
  triggerLabel,
  triggerIcon: Icon,
  title,
  headers,
  rows,
  format,
  fullWidth = false, // 👈 NEW optional prop
  triggerClassName = "", // 👈 optional for extra custom classes
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={[
            "bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg flex items-center gap-2",
            fullWidth ? "w-full justify-center" : "", // 👈 makes button 100% width when enabled
            triggerClassName,
          ].join(" ")}
        >
          {Icon && <Icon className="h-5 w-5" />}
          {triggerLabel}
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden rounded-2xl p-0">
        <DialogHeader className="px-6 pt-4 pb-3">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            {Icon && <Icon className="h-5 w-5 text-primary" />}
            {title}
          </DialogTitle>
        </DialogHeader>

        <div
          className="overflow-y-auto px-6 pb-6"
          style={{ maxHeight: "calc(80vh - 100px)" }}
        >
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-card z-10">
              <tr className="border-b border-border bg-muted/50">
                {headers.map((h, i) => (
                  <th
                    key={i}
                    className={`py-3 px-3 font-semibold ${
                      i === 0 ? "text-left" : "text-left"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-border/30 hover:bg-secondary/10 transition"
                >
                  {Object.entries(row).map(([key, value], i) => {
                    const moneyFields = [
                      "principal",
                      "interest",
                      "payment",
                      "totalPayment",
                      "endingBalance",
                      "beginningBalance",
                      "balance",
                      "amount",
                      "rate",
                      "tradBefore",
                      "tradAfter",
                      "roth",
                      "taxable",
                      "emi"
                    ];

                    const isMoney = moneyFields.includes(key);
                    const isText =
                      typeof value === "string" && !/^\d+(\.\d+)?$/.test(value);

                    let displayValue;

                    if (
                      key.toLowerCase().includes("contribution") &&
                      Number(value) === 0
                    ) {
                      displayValue = "-";
                    } else if (isMoney && format) {
                      displayValue = format(value);
                    } else if (isText) {
                      displayValue = value;
                    } else {
                      displayValue = Number(value || 0).toFixed(1);
                    }

                    return (
                      <td
                        key={i}
                        className={`py-3 px-3 ${
                          i === 0 ? "text-left" : "text-left"
                        } ${
                          key.toLowerCase().includes("interest")
                            ? "text-red-600"
                            : ""
                        } ${
                          key.toLowerCase().includes("payment")
                            ? "text-primary font-semibold"
                            : ""
                        } ${i === headers.length - 1 ? "font-semibold" : ""}`}
                      >
                        {displayValue}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
