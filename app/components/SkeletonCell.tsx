import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

function SkeletonCell({ width = "60%" }: { width?: string }) {
  return (
    <div
      className="h-3 rounded"
      style={{
        width,
        background: "linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)",
        backgroundSize: "500px 100%",
        animation: "skshimmer 1.5s infinite linear",
      }}
    />
  );
}

export function TableSkeleton({
  rows = 5,
  columns = 5,
  selectable = false,
  showActions = false,
}: {
  rows?: number;
  columns?: number;
  selectable?: boolean;
  showActions?: boolean;
}) {
  const colWidths = ["70%", "55%", "65%", "45%", "60%", "50%", "75%"];

  const headStyle = {
    background: "linear-gradient(90deg, #b2e8e7 25%, #d4f3f2 50%, #b2e8e7 75%)",
    backgroundSize: "500px 100%",
    animation: "skshimmer 1.5s infinite linear",
    borderRadius: "4px",
  };

  return (
    <>
      <style>{`
        @keyframes skshimmer {
          0%   { background-position: -500px 0; }
          100% { background-position:  500px 0; }
        }
      `}</style>

      <Table>
        <TableHeader>
          <TableRow className="border-0! bg-navy-50">
            {selectable && (
              <TableHead className="w-12">
                <div className="h-3 w-4" style={headStyle} />
              </TableHead>
            )}
            {Array.from({ length: columns }).map((_, i) => (
              <TableHead key={i}>
                <div
                  className="h-3"
                  style={{ ...headStyle, width: colWidths[i % colWidths.length] }}
                />
              </TableHead>
            ))}
            {showActions && (
              <TableHead>
                <div className="h-3 w-16 mx-auto" style={headStyle} />
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <TableRow
              key={rowIdx}
              className="border-0!"
              style={{ opacity: 1 - rowIdx * 0.12 }}
            >
              {selectable && (
                <TableCell>
                  <div className="h-4 w-4 rounded" style={{
                    background: "#e2e8f0",
                    animation: "skshimmer 1.5s infinite linear",
                  }} />
                </TableCell>
              )}
              {Array.from({ length: columns }).map((_, colIdx) => (
                <TableCell key={colIdx}>
                  <SkeletonCell width={colWidths[(rowIdx + colIdx) % colWidths.length]} />
                </TableCell>
              ))}
              {showActions && (
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <div className="h-6 w-16 rounded" style={{
                      background: "linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)",
                      backgroundSize: "500px 100%",
                      animation: "skshimmer 1.5s infinite linear",
                    }} />
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}