import { Component, inject, signal } from '@angular/core';
import { 
  IDadosGinecoObstetricosRequest, 
  IPaciente, 
  Loading, 
  Mac, 
  MacLabel, 
  PacienteEdicao, 
  StatusPaciente, 
  StatusPacienteLabel, 
  StatusTabagismo,
  StatusTabagismoLabel, 
  SharedModule, 
  ISaudeSexualRequest, 
  Ist, 
  IHistoricoIstRequest, 
  IstLabel, 
  IHistoricoTabagismoRequest, 
  IConsultaResponse, 
  ICitologiaResponse, 
  IPCRResponse, 
  IColposcopiaResponse, 
  IProcedimentoResponse,
  FormularioConsulta,
  IConsultaRequest,
  FormularioCitologia,
  ResultadoCitologiaLabel,
  FormularioPcr,
  ResultadoPCRLabel,
  FormularioColposcopia,
  ResultadoProcedimentoLabel,
  FormularioProcedimento,
  ResultadoCitologia,
  ResultadoPCR,
  TipoAchadoLabel
} from '../../shared';
import { ConsultasService, PacientesService, CitologiasService, PcrsService, ColposcopiasService, ProcedimentosService } from '../../services';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, SlicePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { IPacienteCompletoResponse } from '../../shared/models/IPacienteCompletoResponse';
import { MatIconModule } from '@angular/material/icon';
import { of, switchMap } from 'rxjs';

enum SecaoAcompanhamento {
  CONSULTAS = 'consultas',
  CITOLOGIAS = 'citologias',
  PCR = 'pcr',
  COLPOSCOPIAS = 'colposcopias',
  PROCEDIMENTOS = 'procedimentos'
}

@Component({
  selector: 'app-paciente',
  imports: [
    Loading,
    DatePipe,
    FormsModule,
    MatIconModule,
    SharedModule,
    SlicePipe
  ],
  templateUrl: './paciente.html',
  styleUrl: './paciente.scss',
})
export class Paciente {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(PacientesService);  
  private readonly serviceConsultas = inject(ConsultasService);
  private readonly serviceCitologia = inject(CitologiasService);
  private readonly servicePCR = inject(PcrsService);
  private readonly serviceColposcopia = inject(ColposcopiasService);
  private readonly serviceProcedimento = inject(ProcedimentosService);
  
  private dialog = inject(MatDialog);
  
  loading = signal(false);
  
  paciente = signal<IPacienteCompletoResponse | null>(null);

  consulta = signal<IConsultaRequest | null>(null);

  StatusPacienteLabel = StatusPacienteLabel;
  StatusPaciente = StatusPaciente;

  MAC = Mac;
  MACLabel = MacLabel;
  macOpcoes = Object.values(Mac);

  StatusTabagista = StatusTabagismo;
  StatusTabagistaLabel = StatusTabagismoLabel;
  statusTabagistaOpcoes = Object.values(StatusTabagismo);

  ist = Ist;
  IstLabel = IstLabel;
  istOpcoes = Object.values(Ist);

  editandoGinecoObstetrico: boolean = false;
  editandoSaudeSexual: boolean = false;
  editandoHistoricoIST: boolean = false;
  editandoHistoricoTabagista: boolean = false;

  dadosGinecoObstetricos: IDadosGinecoObstetricosRequest = {
    idPaciente: 0,
    menarca: 0,
    menopausa: 0,
    numGestacao: 0,
    numPartoNormal: 0,
    numCesariana: 0,
    numAborto: 0
  };

  saudeSexual: ISaudeSexualRequest = {
    idPaciente: 0,
    sexarca: 0,
    mac: Mac.NENHUM,
    numParceiros: 0,
    vvs: false
  };

  historicoISTEdicao: IHistoricoIstRequest[] = [];

  historicoIST: IHistoricoIstRequest = {
    idPaciente: 0,
    ist: this.ist.NENHUMA,
    condilomaHpv: false
  }

  historicoTabagismo: IHistoricoTabagismoRequest = {
    idPaciente: 0,
    fumante: StatusTabagismo.NAO_FUMANTE,
    cigarrosDia: null,
    idadeFim: null,
    idadeInicio: null
  };

  secaoSelecionada = SecaoAcompanhamento.CONSULTAS;   
  secaoAcompanhamento = SecaoAcompanhamento;   

  consultas = signal<IConsultaResponse[]>([]);

  citologias = signal<ICitologiaResponse[]>([]);
  ResultadoCitologiaLabel = ResultadoCitologiaLabel;
  ResultadoCitologia = ResultadoCitologia;

  pcrs = signal<IPCRResponse[]>([]);
  ResultadoPCR = ResultadoPCR;
  ResultadoPCRLabel = ResultadoPCRLabel;
  
  colposcopias = signal<IColposcopiaResponse[]>([]);  
  TipoAchadoLabel = TipoAchadoLabel;
  
  procedimentos = signal<IProcedimentoResponse[]>([]);
  ResultadoProcedimentoLabel = ResultadoProcedimentoLabel;

  ngOnInit() {
    const idPaciente = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.service.buscar(idPaciente).subscribe({
      next: (paciente) => {
        this.paciente.set(paciente);

        if (paciente.dadosGinecoObstetricos?.[0]) {
          this.dadosGinecoObstetricos = {
            ...paciente.dadosGinecoObstetricos[0]
          };
        }

        if (paciente.saudeSexual?.[0]) {
          this.saudeSexual = {
            ...paciente.saudeSexual[0]
          };
        }

        if (paciente.historicoTabagismo?.[0]) {
          this.historicoTabagismo = {
            ...paciente.historicoTabagismo[0]
          };
        }
        
        this.historicoISTEdicao = [...(paciente.historicoIst ?? [])];

        this.listarConsultas();
      },
      error: (erro) => {
        console.error('Erro ao buscar paciente:', erro);
      }
    });
  }

  get textoBotaoAdicionar(): string {
    switch (this.secaoSelecionada) {
      case SecaoAcompanhamento.CONSULTAS:
        return 'Nova consulta';
      case SecaoAcompanhamento.CITOLOGIAS:
        return 'Nova citologia';
      case SecaoAcompanhamento.PCR:
        return 'Novo PCR DNA HPV';
      case SecaoAcompanhamento.COLPOSCOPIAS:
        return 'Nova colposcopia';
      case SecaoAcompanhamento.PROCEDIMENTOS:
        return 'Novo procedimento';
      default:
        return 'Adicionar';
    }
  }

  private cancelarTodasEdicoes() {
    this.cancelarEdicaoGinecoObstetrico();
    this.cancelarEdicaoSaudeSexual();
    this.cancelarEdicaoHistoricoIST();
    this.cancelarEdicaoHistoricoTabagista();
  }

  editarGinecoObstetrico() {
    this.cancelarTodasEdicoes();
    this.editandoGinecoObstetrico = true;
  }

  editarSaudeSexual() {
    this.cancelarTodasEdicoes();
    this.editandoSaudeSexual = true;
  }

  editarHistoricoIST() {
    this.cancelarTodasEdicoes();
    this.editandoHistoricoIST = true;
  }

  editarHistoricoTabagista() {
    this.cancelarTodasEdicoes();
    this.editandoHistoricoTabagista = true;
  }

  cancelarEdicaoGinecoObstetrico() {
    const dados = this.paciente()?.dadosGinecoObstetricos?.[0];

    if (dados) {
      this.dadosGinecoObstetricos = { ...dados };
    }

    this.editandoGinecoObstetrico = false;
  }

  salvarDadosGinecoObstetricos() {
    const dados = this.paciente()?.dadosGinecoObstetricos?.[0];
    
    if (!dados) {
      return;
    }
    
    this.service.atualizarDadosGinecoObstetricos(
      dados.idDados,
      this.dadosGinecoObstetricos
    ).subscribe({
      next: (dados) => {
        this.editandoGinecoObstetrico = false;
        this.ngOnInit();
      },
      error: (erro) => {
        console.error('Erro ao atualizar dados gineco-obstétricos:', erro);
      }
    });
  }

  cancelarEdicaoSaudeSexual() {
    const dados = this.paciente()?.saudeSexual?.[0];

    if (dados) {
      this.saudeSexual = { ...dados };
    }

    this.editandoSaudeSexual = false;
  }

  salvarSaudeSexual() {
    const dados = this.paciente()?.saudeSexual?.[0];
    
    if (!dados) {
      return;
    }
    
    this.service.atualizarSaudeSexual(
      dados.idDados,
      this.saudeSexual
    ).subscribe({
      next: (dados) => {
        console.log(dados)
        this.editandoSaudeSexual = false;
        this.ngOnInit();
      },
      error: (erro) => {
        console.error('Erro ao atualizar dados de saúde sexual:', erro);
      }
    });
  }

  cancelarEdicaoHistoricoIST() {
    const dados = this.paciente()?.historicoIst;

    if (dados) {
      this.historicoISTEdicao = [...dados];
    }

    this.editandoHistoricoIST = false;
  }

  // Aguardando alteração no backend
  salvarHistoricoIST() {
    console.log('ANTIGO:', this.paciente()?.historicoIst);
    console.log('NOVO:', this.historicoISTEdicao);
  }

  cancelarEdicaoHistoricoTabagista() {
    const dados = this.paciente()?.historicoTabagismo?.[0];

    if (dados) {
      this.historicoTabagismo = { ...dados };
    }

    this.editandoHistoricoTabagista = false;
  }

  salvarHistoricoTabagista() {
    const dados = this.paciente()?.historicoTabagismo?.[0];

    if (!dados) {
      return;
    }

    if (this.historicoTabagismo.fumante === this.StatusTabagista.NAO_FUMANTE) {
      this.historicoTabagismo.idadeInicio = null;
      this.historicoTabagismo.idadeFim = null;
      this.historicoTabagismo.cigarrosDia = null;
    }

    if (this.historicoTabagismo.fumante === this.StatusTabagista.FUMANTE) {
      this.historicoTabagismo.idadeFim = null;
    }

    this.service.atualizarHistoricoTabagista(
      dados.idHistorico,
      this.historicoTabagismo
    ).subscribe({
      next: (dados) => {
        console.log(dados);
        this.editandoHistoricoTabagista = false;
        this.ngOnInit();
      },
      error: (erro) => {
        console.error('Erro ao atualizar histórico tabagista:', erro);
      }
    });
  }

  podeSalvarHistoricoTabagista(): boolean {
    if (!this.historicoTabagismo.fumante) {
      return false;
    }

    if (this.historicoTabagismo.fumante === StatusTabagismo.NAO_FUMANTE) {
      return true;
    }

    if (
      !this.historicoTabagismo.cigarrosDia ||
      !this.historicoTabagismo.idadeInicio
    ) {
      return false;
    }

    if (
      this.historicoTabagismo.fumante === StatusTabagismo.EX_FUMANTE &&
      !this.historicoTabagismo.idadeFim
    ) {
      return false;
    }

    return true;
  }

  selecionarSecao(secao: SecaoAcompanhamento) {
    this.secaoSelecionada = secao;

    switch (secao) {
      case SecaoAcompanhamento.CONSULTAS:
        this.listarConsultas();
        break;

      case SecaoAcompanhamento.CITOLOGIAS:
        this.listarCitologias();
        break;

      case SecaoAcompanhamento.PCR:
        this.listarPCRs();
        break;

      case SecaoAcompanhamento.COLPOSCOPIAS:
        this.listarColposcopias();
        break;

      case SecaoAcompanhamento.PROCEDIMENTOS:
        this.listarProcedimentos();
        break;
    }
  }

  adicionarAcompanhamento() {
    switch (this.secaoSelecionada) {
      case SecaoAcompanhamento.CONSULTAS:
        this.abrirPopupConsulta('adicionar');
        break;

      case SecaoAcompanhamento.CITOLOGIAS:
        this.abrirPopupCitologia('adicionar');
        break;

      case SecaoAcompanhamento.PCR:
        this.abrirPopupPCR('adicionar');
        break;

      case SecaoAcompanhamento.COLPOSCOPIAS:
        this.abrirPopupColposcopia('adicionar');
        break;

      case SecaoAcompanhamento.PROCEDIMENTOS:
        this.abrirPopupProcedimento('adicionar');
        break;
    }
  }

  alternarIST(ist: Ist) {
    const index = this.historicoISTEdicao.findIndex(
      h => h.ist === ist
    );

    if (index >= 0) {
      this.historicoISTEdicao.splice(index, 1);
      return;
    }

    if (ist === this.ist.NENHUMA || ist === this.ist.NAO_SABE) {
      this.historicoISTEdicao = [
        {
          idPaciente: this.paciente()!.idPaciente,
          ist: ist,
          condilomaHpv: false
        }
      ];

      return;
    }

    this.historicoISTEdicao = this.historicoISTEdicao.filter(
      h => h.ist !== this.ist.NENHUMA &&
          h.ist !== this.ist.NAO_SABE
    );

    this.historicoISTEdicao.push({
      idPaciente: this.paciente()!.idPaciente,
      ist: ist,
      condilomaHpv: false
    });
  }

  alterarCondilomaHpv(valor: boolean) {
    const historico = this.historicoISTEdicao.find(
      h => h.ist === this.ist.HPV
    );

    if (historico) {
      historico.condilomaHpv = valor;
    }
  }

  calcularCargaTabagica(): number {
    const paciente = this.paciente();
    const tabagismo = paciente?.historicoTabagismo?.[0];

    if (!paciente || !tabagismo) {
      return 0;
    }

    if (tabagismo.fumante === this.StatusTabagista.NAO_FUMANTE) {
      return 0;
    }

    if (
      tabagismo.cigarrosDia == null ||
      tabagismo.idadeInicio == null
    ) {
      return 0;
    }

    const idadeFim =
      tabagismo.fumante === this.StatusTabagista.EX_FUMANTE
        ? tabagismo.idadeFim
        : paciente.idade;

    if (idadeFim == null) {
      return 0;
    }

    return (
      tabagismo.cigarrosDia *
      (idadeFim - tabagismo.idadeInicio)
    ) / 20;
  }

  abrirEdicao() {
    const dialogRef = this.dialog.open(PacienteEdicao, {
      width: '500px',
      data: {
        paciente: {
          nome: this.paciente()!.nome,
          dataNascimento: this.paciente()!.dataNascimento,
          prontuario: this.paciente()!.prontuario,
          status: this.paciente()!.status
        }
      }
    });

    dialogRef.componentInstance.salvarFormulario.subscribe(dados => {
      this.loading.set(true);

      this.service.atualizar(
        this.paciente()!.idPaciente,
        dados
      ).subscribe({
        next: () => {
          dialogRef.close();
          this.loading.set(false);

          this.ngOnInit();
        },
        error: (erro) => {
          console.error('Erro ao editar paciente:', erro);

          if (erro.status === 409) {
            if (erro.error?.errorCode === 'recurso_duplicado') {
              dialogRef.componentInstance.marcarErro(
                'prontuario',
                'prontuarioConflito'
              );
            }
          }

          this.loading.set(false);
        }
      });
    });
  }

  listarConsultas() {
    this.loading.set(true);

    const idPaciente = this.paciente()?.idPaciente;

    if (!idPaciente) {
      this.loading.set(false);
      return;
    }

    this.serviceConsultas.listar(idPaciente).subscribe({
      next: (consultas) => {
        this.consultas.set(consultas);
        this.loading.set(false);
      },
      error: (erro) => {
        this.loading.set(false);

        if (erro.status === 500) {
          alert(`Erro interno: ${erro.error}`);
        } else {
          alert('Erro inesperado ao listar consultas.');
          console.log(erro);
        }
      }
    });
  }

  listarCitologias() {
    this.loading.set(true);

    const idPaciente = this.paciente()?.idPaciente;

    if (!idPaciente) {
      this.loading.set(false);
      return;
    }

    this.serviceCitologia.listar(idPaciente).subscribe({
      next: (citologias) => {
        this.citologias.set(citologias);
        this.loading.set(false);
      },
      error: (erro) => {
        this.loading.set(false);

        if (erro.status === 500) {
          alert(`Erro interno: ${erro.error}`);
        } else {
          alert('Erro inesperado ao listar citologias.');
          console.log(erro);
        }
      }
    });
  }

  listarPCRs() {
    this.loading.set(true);

    const idPaciente = this.paciente()?.idPaciente;

    if (!idPaciente) {
      this.loading.set(false);
      return;
    }

    this.servicePCR.listar(idPaciente).subscribe({
      next: (pcrs) => {
        this.pcrs.set(pcrs);
        this.loading.set(false);
      },
      error: (erro) => {
        this.loading.set(false);

        if (erro.status === 500) {
          alert(`Erro interno: ${erro.error}`);
        } else {
          alert('Erro inesperado ao listar consultas.');
          console.log(erro);
        }
      }
    });
  }

  listarColposcopias() {
    this.loading.set(true);

    const idPaciente = this.paciente()?.idPaciente;

    if (!idPaciente) {
      this.loading.set(false);
      return;
    }

    this.serviceColposcopia.listar(idPaciente).subscribe({
      next: (colposcopias) => {
        this.colposcopias.set(colposcopias);
        this.loading.set(false);
      },
      error: (erro) => {
        this.loading.set(false);

        if (erro.status === 500) {
          alert(`Erro interno: ${erro.error}`);
        } else {
          alert('Erro inesperado ao listar colposcopias.');
          console.log(erro);
        }
      }
    });
  }

  listarProcedimentos() {
    this.loading.set(true);

    const idPaciente = this.paciente()?.idPaciente;

    if (!idPaciente) {
      this.loading.set(false);
      return;
    }

    this.serviceProcedimento.listar(idPaciente).subscribe({
      next: (procedimentos) => {
        this.procedimentos.set(procedimentos);
        this.loading.set(false);
      },
      error: (erro) => {
        this.loading.set(false);

        if (erro.status === 500) {
          alert(`Erro interno: ${erro.error}`);
        } else {
          alert('Erro inesperado ao listar procedimentos.');
          console.log(erro);
        }
      }
    });
  }

  abrirPopupConsulta(
    modo: 'adicionar' | 'visualizar',
    consultaExistente?: IConsultaResponse
  ) {
    const paciente = this.paciente();

    if (!paciente) {
      return;
    }

    const dialogRef = this.dialog.open(FormularioConsulta, {
      width: '500px',
      data: {
        modo,
        consulta: modo === 'adicionar'
          ? {
              idPaciente: paciente.idPaciente,
              dataHora: '',
              observacao: ''
            }
          : consultaExistente,
        paciente: {
          nome: paciente.nome,
          status: paciente.status
        }
      }
    });

    if (modo !== 'adicionar') {
      return;
    }

    dialogRef.componentInstance.salvarFormulario.subscribe((dados) => {
      this.loading.set(true);

      const idPaciente = paciente.idPaciente;
      const novoStatus = dados.status;
      const statusMudou = novoStatus !== paciente.status;

      const dadosConsulta: IConsultaRequest = {
        ...dados.consulta,
        idPaciente
      };

      this.serviceConsultas.inserir(dadosConsulta).pipe(
        switchMap((consultaSalva) => {
          if (!statusMudou) {
            return of(consultaSalva);
          }

          return this.service.atualizarStatus(
            idPaciente,
            novoStatus
          );
        })
      ).subscribe({
        next: () => {
          dialogRef.close();

          this.loading.set(false);

          this.ngOnInit();
        },
        error: (erro) => {
          console.error('Erro ao salvar a consulta:', erro);
          this.loading.set(false);
        }
      });
    });
  }

  abrirPopupCitologia(
    modo: 'adicionar' | 'visualizar',
    citologiaExistente?: ICitologiaResponse
  ) {
    const paciente = this.paciente();

    if (!paciente) {
      return;
    }

    const dialogRef = this.dialog.open(FormularioCitologia, {
      width: '500px',
      data: {
        modo,
        citologiaExistente,
        idPaciente: paciente.idPaciente
      }
    });

    dialogRef.componentInstance.salvarFormulario.subscribe((evento) => {
      this.loading.set(true);

      if (evento.modo === 'adicionar') {
        this.serviceCitologia.inserir(evento.dados).subscribe({
          next: () => {
            dialogRef.close();
            this.listarCitologias();
            this.loading.set(false);
          },
          error: (erro) => {
            console.error('Erro ao inserir citologia:', erro);
            this.loading.set(false);
          }
        });
      } else {
        if (evento.id === undefined) {
          this.loading.set(false);
          return;
        }

        this.serviceCitologia.alterar(evento.id, evento.dados).subscribe({
          next: () => {
            dialogRef.close();
            this.listarCitologias();
            this.loading.set(false);
          },
          error: (erro) => {
            console.error('Erro ao alterar citologia:', erro);
            this.loading.set(false);
          }
        });
      }
    });
  }

  abrirPopupPCR(
    modo: 'adicionar' | 'visualizar',
    pcrExistente?: IPCRResponse
  ) {
    const paciente = this.paciente();

    if (!paciente) {
      return;
    }

    const dialogRef = this.dialog.open(FormularioPcr, {
      width: '500px',
      data: {
        modo,
        pcrExistente,
        idPaciente: paciente.idPaciente
      }
    });

    dialogRef.componentInstance.salvarFormulario.subscribe((evento) => {
      this.loading.set(true);

      if (evento.modo === 'adicionar') {
        this.servicePCR.inserir(evento.dados).subscribe({
          next: () => {
            dialogRef.close();
            this.listarPCRs();
            this.loading.set(false);
          },
          error: (erro) => {
            console.error('Erro ao inserir citologia:', erro);
            this.loading.set(false);
          }
        });
      } else {
        if (evento.id === undefined) {
          this.loading.set(false);
          return;
        }

        this.servicePCR.alterar(evento.id, evento.dados).subscribe({
          next: () => {
            dialogRef.close();
            this.listarPCRs();
            this.loading.set(false);
          },
          error: (erro) => {
            console.error('Erro ao alterar PCR:', erro);
            this.loading.set(false);
          }
        });
      }
    });
  }

  abrirPopupColposcopia(
    modo: 'adicionar' | 'visualizar',
    colposcopiaExistente?: IColposcopiaResponse
  ) {
    const paciente = this.paciente();

    if (!paciente) {
      return;
    }

    const dialogRef = this.dialog.open(FormularioColposcopia, {
      width: '750px',
      data: {
        modo,
        colposcopiaExistente,
        idPaciente: paciente.idPaciente
      }
    });

    dialogRef.componentInstance.salvarFormulario.subscribe((evento) => {
      this.loading.set(true);

      console.log(evento);

      if (evento.modo === 'adicionar') {
        this.serviceColposcopia.inserir(evento.dados).subscribe({
          next: () => {
            dialogRef.close();
            this.listarColposcopias();
            this.loading.set(false);
          },
          error: (erro) => {
            console.error('Erro ao inserir Colposcopia:', erro);
            this.loading.set(false);
          }
        });
      } else {
        if (evento.id === undefined) {
          this.loading.set(false);
          return;
        }

        this.serviceColposcopia.alterar(evento.id, evento.dados).subscribe({
          next: () => {
            dialogRef.close();
            this.listarColposcopias();
            this.loading.set(false);
          },
          error: (erro) => {
            console.error('Erro ao alterar Colposcopia:', erro);
            this.loading.set(false);
          }
        });
      }
    });
  }

  abrirPopupProcedimento(
    modo: 'adicionar' | 'visualizar',
    procedimentoExistente?: IProcedimentoResponse
  ) {
    const paciente = this.paciente();

    if (!paciente) {
      return;
    }

    const dialogRef = this.dialog.open(FormularioProcedimento, {
      width: '750px',
      data: {
        modo,
        procedimentoExistente,
        idPaciente: paciente.idPaciente
      }
    });

    dialogRef.componentInstance.salvarFormulario.subscribe((evento) => {
      this.loading.set(true);

      if (evento.modo === 'adicionar') {
        this.serviceProcedimento.inserir(evento.dados).subscribe({
          next: () => {
            dialogRef.close();
            this.listarProcedimentos();
            this.loading.set(false);
          },
          error: (erro) => {
            console.error('Erro ao inserir Colposcopia:', erro);
            this.loading.set(false);
          }
        });
      } else {
        if (evento.id === undefined) {
          this.loading.set(false);
          return;
        }

        this.serviceProcedimento.alterar(evento.id, evento.dados).subscribe({
          next: () => {
            dialogRef.close();
            this.listarProcedimentos();
            this.loading.set(false);
          },
          error: (erro) => {
            console.error('Erro ao alterar Colposcopia:', erro);
            this.loading.set(false);
          }
        });
      }
    });
  }
}