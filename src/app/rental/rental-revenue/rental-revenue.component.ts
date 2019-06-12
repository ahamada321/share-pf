import { Component, OnInit } from '@angular/core';
import { PaymentService } from 'src/app/common/components/payment/services/payment.service';
import * as moment from "moment"
import { Router, NavigationEnd } from '@angular/router';


//t = current time
//b = start value
//c = change in value
//d = duration
var easeInOutQuad = function (t, b, c, d) {
  t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};
@Component({
  selector: 'app-rental-revenue',
  templateUrl: './rental-revenue.component.html',
  styleUrls: ['./rental-revenue.component.scss']
})
export class RentalRevenueComponent implements OnInit {
  canvas: any;
  pageIndex: number = 4
  payments: any // This is for frontend UI
  headerOffset: number = 70; // want to replace like DEFINE HEADER_OFFSET
  
  DashboardChartType = 'line'
  DashboardChartOptions:any
  DashboardChartDatasets:Array<any>
  DashboardChartLabels:Array<any>
  DashboardChartColors:Array<any>

  DashboardRevenueData:Array<any> // Going to use

  constructor(private paymentService: PaymentService,
              public router: Router) {
    router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
        const tree = router.parseUrl(router.url);
        if (tree.fragment) {
          const element = document.querySelector("#" + tree.fragment);
          if (element) { element.scrollIntoView(); }
        }
      }
    })
  }

  ngOnInit() {
    this.initDashboardChart()
    this.getPaidPayments()

    // Also adding exception logic in app.component.ts for NavBar
    let navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
  }

  getPaidPayments() {
    this.paymentService.getPaidPayments().subscribe(
      (payments) => {
        this.payments = payments
        this.setRevenueToDashboardChart(payments)
      },
      () => {
        // in case if user is not logined, or no paid data yet.
      }
    )
  }

  getTotalRevenue() {
    let total = 0;
    for(let payment of this.payments) {
        let integer = parseInt(payment.ownerRevenue)
        total += integer;
    } 
    return total;
}

  initDashboardChart() {
    this.canvas = document.getElementById("dashboardChart");
    let chartColor = "#FFFFFF";
    let ctx = this.canvas.getContext("2d");

    let gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
    gradientStroke.addColorStop(0, '#80b6f4');
    gradientStroke.addColorStop(1, chartColor);

    let gradientFill = ctx.createLinearGradient(0, 200, 0, 50);
    gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    gradientFill.addColorStop(1, "rgba(255, 255, 255, 0.24)");

    this.DashboardChartDatasets = [
      {
        label: "Data",
        pointBorderWidth: 1,
        pointHoverRadius: 7,
        pointHoverBorderWidth: 2,
        pointRadius: 5,
        fill: true,
        borderWidth: 2,
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
    ]

    this.DashboardChartColors = [
      {
        backgroundColor: gradientFill,
        borderColor: chartColor,
        pointBorderColor: chartColor,
        pointBackgroundColor: "#2c2c2c",
        pointHoverBackgroundColor: "#2c2c2c",
        pointHoverBorderColor: chartColor,
      }
    ]
    this.DashboardChartLabels = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    this.DashboardChartOptions = {
      layout: {
        padding: {
          left: 20,
          right: 20,
          top: 0,
          bottom: 0
        }
      },
      maintainAspectRatio: false,
      tooltips: {
        backgroundColor: '#fff',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      legend: {
          position: "bottom",
          fillStyle: "#FFF",
          display: false
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: "rgba(255,255,255,0.4)",
            fontStyle: "bold",
            beginAtZero: true,
            maxTicksLimit: 5,
            padding: 10
          },
          gridLines: {
            drawTicks: true,
            drawBorder: false,
            display: true,
            color: "rgba(255,255,255,0.1)",
            zeroLineColor: "transparent"
          }
        }],
        xAxes: [{
          gridLines: {
            zeroLineColor: "transparent",
            display: false,
          },
          ticks: {
            padding: 10,
            fontColor: "rgba(255,255,255,0.4)",
            fontStyle: "bold"
          }
        }]
      }
    }
  }

  setRevenueToDashboardChart(payments) {
    let revenue_Jan = 0
    let revenue_Feb = 0
    let revenue_Mar = 0
    let revenue_Apr = 0
    let revenue_May = 0
    let revenue_Jun = 0
    let revenue_Jul = 0
    let revenue_Aug = 0
    let revenue_Sep = 0
    let revenue_Oct = 0
    let revenue_Nov = 0
    let revenue_Dec = 0
    
    if(payments) {
      for(let payment of payments) {
        if(moment(payment.paidAt).format("YYYY") == moment().format("YYYY")) {
          if(moment(payment.paidAt).format("MM") == moment().month("December").format("MM")) {
            revenue_Dec += payment.ownerRevenue
          } else if(moment(payment.paidAt).format("MM") == moment().month("November").format("MM")) {
            revenue_Nov += payment.ownerRevenue
          } else if(moment(payment.paidAt).format("MM") == moment().month("October").format("MM")) {
            revenue_Oct += payment.ownerRevenue
          } else if(moment(payment.paidAt).format("MM") == moment().month("September").format("MM")) {
            revenue_Sep += payment.ownerRevenue
          } else if(moment(payment.paidAt).format("MM") == moment().month("August").format("MM")) {
            revenue_Aug += payment.ownerRevenue
          } else if(moment(payment.paidAt).format("MM") == moment().month("July").format("MM")) {
            revenue_Jul += payment.ownerRevenue
          } else if(moment(payment.paidAt).format("MM") == moment().month("June").format("MM")) {
            revenue_Jun += payment.ownerRevenue
          } else if(moment(payment.paidAt).format("MM") == moment().month("May").format("MM")) {
            revenue_May += payment.ownerRevenue
          } else if(moment(payment.paidAt).format("MM") == moment().month("April").format("MM")) {
            revenue_Apr += payment.ownerRevenue
          } else if(moment(payment.paidAt).format("MM") == moment().month("March").format("MM")) {
            revenue_Mar += payment.ownerRevenue
          } else if(moment(payment.paidAt).format("MM") == moment().month("Febraury").format("MM")) {
            revenue_Feb += payment.ownerRevenue
          } else if(moment(payment.paidAt).format("MM") == moment().month("January").format("MM")) {
            revenue_Jan += payment.ownerRevenue
          }
        }  
      }
    }

    this.DashboardChartDatasets = [
      {
        label: "Data",
        pointBorderWidth: 1,
        pointHoverRadius: 7,
        pointHoverBorderWidth: 2,
        pointRadius: 5,
        fill: true,
        borderWidth: 2,
        data: [revenue_Jan, revenue_Feb, revenue_Mar, revenue_Apr, revenue_May, revenue_Jun, revenue_Jul, revenue_Aug, revenue_Sep, revenue_Oct, revenue_Nov, revenue_Dec]
      }
    ]
  }

  chartClicked(e:any):void {
    // console.log(e);
  }

  chartHovered(e:any):void {
    // console.log(e);
  }

  smoothScroll(target) {
    let targetScroll = document.getElementById(target);
    this.scrollTo(document.scrollingElement || document.documentElement, targetScroll.offsetTop - this.headerOffset, 625); // Updated by Creative Tim support!
  }

  private scrollTo(element, to, duration) {
    let start = element.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 20;

    let animateScroll = function(){
        currentTime += increment;
        var val = easeInOutQuad(currentTime, start, change, duration);
        element.scrollTop = val;
        if(currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();
  }
}
