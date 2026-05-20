interface BadgeProps {
  status: 'confirmado' | 'aguardando' | 'cancelado' | 'approved' | 'pending' | 'rejected' | 'active' | 'inactive'
  label?: string
}

const config: Record<BadgeProps['status'], string> = {
  confirmado: 'bg-teal-clinic/10 text-teal-clinic border border-teal-clinic/20',
  approved:   'bg-teal-clinic/10 text-teal-clinic border border-teal-clinic/20',
  active:     'bg-teal-clinic/10 text-teal-clinic border border-teal-clinic/20',
  aguardando: 'bg-gold/15 text-gold-dark border border-gold/20',
  pending:    'bg-gold/15 text-gold-dark border border-gold/20',
  cancelado:  'bg-red-500/10 text-red-400 border border-red-500/20',
  rejected:   'bg-red-500/10 text-red-400 border border-red-500/20',
  inactive:   'bg-stone-muted/10 text-stone-muted border border-stone-muted/20',
}

const labels: Record<BadgeProps['status'], string> = {
  confirmado: 'Confirmado',
  aprovado:   'Aprovado',
  approved:   'Aprovado',
  active:     'Ativo',
  aguardando: 'Aguardando',
  pending:    'Pendente',
  cancelado:  'Cancelado',
  rejected:   'Rejeitado',
  inactive:   'Inativo',
}

export function Badge({ status, label }: BadgeProps) {
  return (
    <span className={`inline-block px-3 py-0.5 rounded-full text-[11px] tracking-wide uppercase font-medium ${config[status]}`}>
      {label ?? labels[status] ?? status}
    </span>
  )
}
