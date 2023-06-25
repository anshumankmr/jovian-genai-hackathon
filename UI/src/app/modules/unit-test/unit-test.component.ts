import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiurlsService } from 'src/app/configs/api-urls.service';
import { DataService } from 'src/app/configs/data.service';

@Component({
  selector: 'app-unit-test',
  templateUrl: './unit-test.component.html',
  styleUrls: ['./unit-test.component.scss']
})
export class UnitTestComponent {
  codeText = new FormControl();
  streamedData: any[] = [];

  unitTestLoading = "";

  constructor(private activatedroute: ActivatedRoute,
    private route: Router,
    public dataService: DataService,
    public urls: ApiurlsService
  ) {
  }

  generateDoc(): boolean {
    if (this.codeText.value) {
      this.getMainSearchResults();
      return true;
    } else {
      return false;
    }
  }


  async getMainSearchResults() {
    this.unitTestLoading = "loading";
    const data = {
      prompt: this.codeText.value,
    }
    this.streamedData = [];
    const stream = await this.dataService.postStream(`${this.urls.testCaseUrl}`, data);

    if (stream) {
      const reader = stream.getReader();
      const processStream = async () => {
        while (true) {
          const result = await reader.read();

          if (result?.done) {
            this.unitTestLoading = 'data';
            break;
          }
          this.handleStreamData(result?.value);
        }
      };

      processStream();
    }
  }

  handleStreamData(data: any) {
    const textData = new TextDecoder().decode(data);
    this.streamedData = [textData];
  }
}
