import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { CabecalhoPagina, Loading, IPacienteCompletoRequest, StatusPaciente, StatusPacienteLabel, metodosContraceptivos, tiposIst, TipoIst, MetodoContraceptivo, StatusFumante } from '../../shared';
import { PacientesService } from '../../services';

@Component({
  selector: 'app-novo-paciente',
  imports: [CommonModule, ReactiveFormsModule, CabecalhoPagina, Loading],
  templateUrl: './novo-paciente.html', styleUrl: './novo-paciente.scss'
})
export class NovoPaciente {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(PacientesService);
  private readonly router = inject(Router);
  readonly etapa = signal(0);
  readonly loading = signal(false);
  readonly erro = signal('');
  readonly titulos = ['Dados pessoais', 'Gineco-obstétricos', 'Saúde sexual', 'Histórico de IST', 'Tabagismo', 'Conferir e cadastrar'];
  readonly status = Object.entries(StatusPacienteLabel);
  readonly metodos = Object.entries(metodosContraceptivos);
  readonly ists = Object.entries(tiposIst) as [TipoIst, string][];
  readonly hoje = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
  readonly formulario = this.fb.group({
    paciente: this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(45), Validators.pattern(/.*\S.*/)]],
      dataNascimento: this.fb.control<string>('', [Validators.required, (c: AbstractControl) => {
        if (!c.value) return null;
        const d = new Date(c.value + 'T12:00:00');
        return Number.isNaN(d.getTime()) || d > new Date() ? { dataInvalida: true } : null;
      }]),
      prontuario: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/.*\S.*/)]],
      status: this.fb.control<StatusPaciente | null>(null, Validators.required)
    }),
    dadosGinecoObstetricos: this.fb.group({
      numGestacao: this.numero(), numPartoNormal: this.numero(), numCesariana: this.numero(),
      numAborto: this.numero(), menarca: this.numero(), menopausa: this.numero(false)
    }),
    saudeSexual: this.fb.group({
      sexarca: this.numero(), mac: this.fb.control<MetodoContraceptivo | null>(null, Validators.required),
      numParceiros: this.numero(), vvs: this.fb.control<boolean | null>(null, Validators.required)
    }),
    historicoTabagismo: this.fb.group({
      fumante: this.fb.control<StatusFumante | null>(null, Validators.required),
      cigarrosDia: this.numero(false), idadeInicio: this.numero(false), idadeFim: this.numero(false)
    }),
    historicoIst: this.fb.nonNullable.control<TipoIst[]>([], Validators.required),
    condilomaHpv: this.fb.control<boolean | null>(null)
  });
  readonly camposObstetricos = [
    ['numGestacao', 'Gestações'], ['numPartoNormal', 'Partos normais'], ['numCesariana', 'Cesarianas'],
    ['numAborto', 'Abortos'], ['menarca', 'Idade da menarca'], ['menopausa', 'Idade da menopausa (opcional)']
  ];
  private numero(obrigatorio = true) {
    return this.fb.control<number | null>(null, [Validators.min(0), Validators.pattern(/^\d+$/), ...(obrigatorio ? [Validators.required] : [])]);
  }
  grupoAtual(): FormGroup | null {
    return [this.formulario.controls.paciente, this.formulario.controls.dadosGinecoObstetricos,
      this.formulario.controls.saudeSexual, null, this.formulario.controls.historicoTabagismo][this.etapa()] ?? null;
  }
  invalido(caminho: string): boolean {
    const c = this.formulario.get(caminho);
    return !!c && c.invalid && c.touched;
  }
  selecionarIst(ist: TipoIst, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    let itens = this.formulario.controls.historicoIst.value.filter(i => i !== ist);
    if (checked) itens = ['NAO_SABE', 'NENHUMA'].includes(ist) ? [ist] : [...itens.filter(i => !['NAO_SABE', 'NENHUMA'].includes(i)), ist];
    this.formulario.controls.historicoIst.setValue(itens);
    if (!itens.includes('HPV')) this.formulario.controls.condilomaHpv.reset();
  }
  validarEtapa(): boolean {
    this.erro.set('');
    if (this.etapa() === 3) {
      this.formulario.controls.historicoIst.markAsTouched();
      if (!this.formulario.controls.historicoIst.value.length) { this.erro.set('Informe o histórico de IST, incluindo “Nenhuma” ou “Não sabe”, se aplicável.'); return false; }
      if (this.formulario.controls.historicoIst.value.includes('HPV') && this.formulario.controls.condilomaHpv.value === null) { this.erro.set('Informe se há condiloma relacionado ao HPV.'); return false; }
    }
    const grupo = this.grupoAtual();
    grupo?.markAllAsTouched();
    if (grupo?.invalid) { this.erro.set('Revise os campos obrigatórios e os valores informados.'); return false; }
    if (this.etapa() === 4) {
      const h = this.formulario.controls.historicoTabagismo.getRawValue();
      if (h.fumante !== 'NAO_FUMANTE' && (h.idadeInicio === null || h.cigarrosDia === null || (h.fumante === 'EX_FUMANTE' && (h.idadeFim === null || h.idadeFim < h.idadeInicio)))) {
        this.erro.set('Informe cigarros por dia e as idades de início e término em ordem cronológica.'); return false;
      }
    }
    return true;
  }
  continuar() { if (this.validarEtapa()) this.etapa.update(e => e + 1); }
  voltar() { this.erro.set(''); this.etapa.update(e => Math.max(0, e - 1)); }
  cancelar() {
    void this.router.navigate(['/pacientes']);
  }
  payload(): IPacienteCompletoRequest {
    const v = this.formulario.getRawValue();
    return {
      paciente: { ...v.paciente, nome: v.paciente.nome!.trim(), prontuario: v.paciente.prontuario!.trim() } as IPacienteCompletoRequest['paciente'],
      dadosGinecoObstetricos: v.dadosGinecoObstetricos as IPacienteCompletoRequest['dadosGinecoObstetricos'],
      saudeSexual: v.saudeSexual as IPacienteCompletoRequest['saudeSexual'],
      historicoTabagismo: { ...v.historicoTabagismo, fumante: v.historicoTabagismo.fumante!,
        ...(v.historicoTabagismo.fumante === 'NAO_FUMANTE' ? { cigarrosDia: null, idadeInicio: null, idadeFim: null } : {}),
        ...(v.historicoTabagismo.fumante === 'FUMANTE' ? { idadeFim: null } : {}) },
      historicoIst: v.historicoIst.map(ist => ({ ist, condilomaHpv: ist === 'HPV' ? v.condilomaHpv : null }))
    };
  }
  resumo() {
    const p = this.payload();
    return [
      [p.paciente.nome, p.paciente.dataNascimento, p.paciente.prontuario, StatusPacienteLabel[p.paciente.status]].join(' · '),
      `Gestações: ${p.dadosGinecoObstetricos.numGestacao} · Partos normais: ${p.dadosGinecoObstetricos.numPartoNormal} · Cesarianas: ${p.dadosGinecoObstetricos.numCesariana} · Abortos: ${p.dadosGinecoObstetricos.numAborto} · Menarca: ${p.dadosGinecoObstetricos.menarca} · Menopausa: ${p.dadosGinecoObstetricos.menopausa ?? 'Não informada'}`,
      `Sexarca: ${p.saudeSexual.sexarca} · Parceiros: ${p.saudeSexual.numParceiros} · MAC: ${metodosContraceptivos[p.saudeSexual.mac]} · VVS: ${p.saudeSexual.vvs ? 'Sim' : 'Não'}`,
      p.historicoIst.map(i => tiposIst[i.ist] + (i.ist === 'HPV' ? ` (condiloma: ${i.condilomaHpv ? 'Sim' : 'Não'})` : '')).join(' · '),
      `${p.historicoTabagismo.fumante} · Cigarros/dia: ${p.historicoTabagismo.cigarrosDia ?? '—'} · Início: ${p.historicoTabagismo.idadeInicio ?? '—'} · Término: ${p.historicoTabagismo.idadeFim ?? '—'}`
    ];
  }
  cadastrar() {
    if (this.loading()) return;
    for (let e = 0; e < 5; e++) { this.etapa.set(e); if (!this.validarEtapa()) return; }
    this.etapa.set(5); this.loading.set(true);
    this.service.cadastrarCompleto(this.payload()).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: () => { this.formulario.markAsPristine(); void this.router.navigate(['/pacientes']); },
      error: (e) => {
        if (e.status === 409) { this.etapa.set(0); this.erro.set('Já existe uma paciente com este prontuário. Confira o cadastro existente.'); }
        else if (e.status === 400) this.erro.set(Object.values(e.error?.messages ?? {}).join(' · ') || 'Revise os dados informados.');
        else if (e.status === 401) this.erro.set('Sua sessão expirou. Faça login novamente.');
        else if (e.status === 403) this.erro.set('Você não tem permissão para cadastrar pacientes.');
        else this.erro.set('Não foi possível cadastrar. Seus dados foram preservados; tente novamente.');
      }
    });
  }
}
