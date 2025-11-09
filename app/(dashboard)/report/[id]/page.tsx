export default function ReportPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Rapport d&apos;Analyse</h1>
      <div className="space-y-6">
        {/* Report content will be implemented later */}
        <p className="text-muted-foreground">ID: {params.id}</p>
      </div>
    </div>
  )
}
