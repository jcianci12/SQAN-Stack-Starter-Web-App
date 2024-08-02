import { Injectable } from '@angular/core';
import { Product } from 'src/app/api/Client';
import { DecimalQuestion } from '../fieldclasses/DecimalQuestion';
import { ImageUpload } from '../fieldclasses/ImageUpload';
import { TextboxQuestion } from '../fieldclasses/question-textbox';
import { TimeSpanQuestion } from '../fieldclasses/TimeSpanQuestion';
import { AutocompleteProductCategoryQuestion } from '../fieldclasses/autocomplete-productcategory-question';
import { QuestionBase } from '../fieldclasses/question-base';
import { WYSIWYGQuestion } from '../fieldclasses/wysiwyg';
import { TieredPricingFieldComponent } from '../components/tieredpricingfield/tieredpricingfield.component';
import { TieredCostQuestion } from '../fieldclasses/TieredCostQuestion';

@Injectable({
  providedIn: 'root'
})

export class ProductCreateQuestionService {


  getQuestions() {

    type productKeys = keyof typeof Product;

    let questions: QuestionBase<any>[] = [

      new TextboxQuestion({
        key: 'id',
        hiddenfield: true
      }),

      new TextboxQuestion({
        key: 'storeModelId',
        hiddenfield: true
      }),

      new TextboxQuestion({
        key: 'name',
        label: "Product name",
        required: true
      }),
      new WYSIWYGQuestion({

        key: 'description',
        label: "Product description",

        required: true
      }),
      // productCategoryId?: number;

      new AutocompleteProductCategoryQuestion({
        key: 'productCategoryId',
        label: 'Product Category',
        required: true,
        hiddenfield: 'productCategoryIdhiddenfield',

      }),

      

      new TieredCostQuestion({
        key: "tieredHireCostPerHour",
        label: "Pricing tiers",
        required: true
      }),


      // buyingPrice?: number;

      new DecimalQuestion({
        key: 'buyingPrice',
        label: "Purchase Price"
      }),
      // minimumHirePeriodInHours?: TimeSpan;

      new TimeSpanQuestion({
        key: "minimumHirePeriodInHours",
        label: "Minimum hire time (in hours)",
        required: true

      }),
      // maximumHirePeriodInHours?: TimeSpan;

      new TimeSpanQuestion({
        key: "maximumHirePeriodInHours",
        label: "Maximum hire time (in hours)",
        required: true

      }),

    ];

    return questions
    //.sort((a, b) => a.order - b.order);
  }

}


export class ProductEditQuestionService {


  getQuestions() {

    type productKeys = keyof typeof Product;

    let questions: QuestionBase<any>[] = [

     
      new TextboxQuestion({
        key: 'id',
        hiddenfield: true
      }),

      new TextboxQuestion({
        key: 'storeModelId',
        hiddenfield: true
      }),

      new TextboxQuestion({
        key: 'name',
        label: "Product name",
        required: true
      }),
      new WYSIWYGQuestion({

        key: 'description',
        label: "Product description",

        required: true
      }),
      // productCategoryId?: number;

      new AutocompleteProductCategoryQuestion({
        key: 'productCategoryId',
        label: 'Product Category',
        required: true,
        hiddenfield: 'productCategoryIdhiddenfield',

      }),

      // new DecimalQuestion({

      //   key: 'hireCostPerHour',
      //   label: "Hire cost (per hour)",

      //   required: true
      // }),
      
      new TieredCostQuestion({
        key: "tieredHireCostPerHour",
        label: "Pricing tiers",
        required: true
      }),

      // buyingPrice?: number;

      new DecimalQuestion({
        key: 'buyingPrice',
        label: "Purchase Price"
      }),
      // minimumHirePeriodInHours?: TimeSpan;

      new TimeSpanQuestion({
        key: "minimumHirePeriodInHours",
        label: "Minimum hire time (in hours)",
        require: true

      }),
      // maximumHirePeriodInHours?: TimeSpan;

      new TimeSpanQuestion({
        key: "maximumHirePeriodInHours",
        label: "Maximum hire time (in hours)",
        require: true

      }),
    ];

    return questions
    //.sort((a, b) => a.order - b.order);
  }

}
