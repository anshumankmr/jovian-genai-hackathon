import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { SearchComponent } from './modules/search/search.component';
import { UnitTestComponent } from './modules/unit-test/unit-test.component';
import { DocumentationComponent } from './modules/documentation/documentation.component';
import { ErrorComponent } from './modules/error/error.component';

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: HomeComponent
  },
  {
    path: "search",
    component: SearchComponent
  },
  {
    path: "unit-test",
    component: UnitTestComponent
  },
  {
    path: "documentation",
    component: DocumentationComponent
  },
  {
    path: "**",
    component: ErrorComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
