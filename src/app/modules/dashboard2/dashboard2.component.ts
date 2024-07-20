import { Component, Inject, inject, ViewChild } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { AsyncPipe, DOCUMENT } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ApexAxisChartSeries, ApexDataLabels, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import {  ApexChart } from "ng-apexcharts";
import { ProductosService } from '../../services/productos/productos.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  title: ApexTitleSubtitle;
  dataLabels: ApexDataLabels;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  tooltip: ApexTooltip;
  labels: any;
};

@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrl: './dashboard2.component.scss',
  standalone: true,
  imports: [
    AsyncPipe,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    NgApexchartsModule,
    MatProgressSpinnerModule
  ]
})
export class Dashboard2Component {
  private breakpointObserver = inject(BreakpointObserver);
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: any;
  public isDarkTheme: boolean;
  loading:boolean = false;

  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Card 1', cols: 1, rows: 1 },
          { title: 'Card 2', cols: 1, rows: 1 },
          { title: 'Card 3', cols: 1, rows: 1 },
          { title: 'Card 4', cols: 1, rows: 1 }
        ];
      }

      return [
        { title: 'Card 1', cols: 2, rows: 1 },
        { title: 'Card 2', cols: 1, rows: 1 },
        { title: 'Card 3', cols: 1, rows: 2 },
        { title: 'Card 4', cols: 1, rows: 1 }
      ];
    })
  );

  constructor(@Inject(DOCUMENT) private document: Document, private productService: ProductosService) {
    this.isDarkTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.chartOptions = {
      series: [10, 20, 30, 40, 50], // Datos del gráfico de pastel
      chart: {
        type: 'pie', // Tipo de gráfico: pastel
        height: 350 // Altura del gr

      },
      labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
      title: {
        text: 'Productos mas vendidos',
        style: {
          color: this.isDarkTheme ? '#FFFFFF' : '#000000'
        }
      },
      dataLabels: {
        style: {
          colors: [this.isDarkTheme ? '#FFFFFF' : '#000000']
        }
      },
      tooltip: {
        theme: this.isDarkTheme ? 'dark' : 'light'
      },
      legend: {
        labels: {
          colors: this.isDarkTheme ? '#FFFFFF' : '#000000'
        },
        position: 'bottom'
      }
    };
  }

  ngOnInit(): void {
    // Optional: listen for theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      this.isDarkTheme = e.matches;
      this.updateChartTheme();
    });

    this.masVendidos('2024-01-01', '2024-12-31');
  }

  ngAfterViewInit(): void {
    this.updateChartTheme();
  }

  updateChartTheme() {
    if (this.chart) {
      this.chartOptions.title.style.color = this.isDarkTheme ? '#FFFFFF' : '#000000';
      this.chartOptions.dataLabels.style.colors = [this.isDarkTheme ? '#FFFFFF' : '#000000'];
      this.chartOptions.legend.labels.colors = this.isDarkTheme ? '#FFFFFF' : '#000000';
      this.chartOptions.tooltip.theme = this.isDarkTheme ? 'dark' : 'light';
      this.chart.updateOptions(this.chartOptions);
    }
  }

  masVendidos(fecha_inicio: string, fecha_fin: string) {
    this.loading = true;
    this.productService.masVendidos(fecha_inicio, fecha_fin).subscribe((data: any) => {
      this.chartOptions.series = data.map((producto: any) => producto.total_vendido);
      this.chartOptions.labels = data.map((producto: any) => producto.nombre_producto);
      this.updateChartTheme();
      this.loading = false;
    });
  }

}
