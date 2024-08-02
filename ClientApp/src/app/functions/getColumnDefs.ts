export function getColumnDefs(): Array<columnDef> {
  return [

    { headerName: 'No.', field: 'No.', sortable: true, filter: true },
    { headerName: 'Activity', field: 'Activity', sortable: true, filter: true, editable: true },
    { headerName: 'Contact name', field: 'Contact name', sortable: true, filter: true, editable: true },
    { headerName: 'DOB', field: 'DOB', sortable: true, filter: true },
    { headerName: 'Relationship with case', field: 'Relationship_with_case', sortable: true, filter: true },
    { headerName: 'Contact Details', field: 'Contact_details', sortable: true, filter: true },
    { headerName: 'Suburb', field: 'Suburb', sortable: true, filter: true },
    { headerName: 'Contact Dates', field: 'Contact_dates', sortable: true, filter: true },
    { headerName: 'Occupation', field: 'Occupation', sortable: true, filter: true },
    { headerName: 'Vaccinated - dose number and date', field: 'Vaccinated_dose_number_and_date', sortable: true, filter: true },
    { headerName: 'Immunocompromised / pregnant', field: 'Immunocompromised_Pregnant', sortable: true, filter: true },
    { headerName: 'GP name (if known)', field: 'GP_name', sortable: true, filter: true },
    { headerName: 'GP contact details', field: 'GP_contact_details', sortable: true, filter: true },
    { headerName: 'Symptomatic (provide details)', field: 'Symptomatic_details', sortable: true, filter: true },
    { headerName: 'PHU contact', field: 'PHU_contact', sortable: true, filter: true },
    { headerName: 'Details of recommendation', field: 'Details_of_recommendations', sortable: true, filter: true },
    { headerName: 'Comments', field: 'Comments', sortable: true, filter: true },
  ];
}



export class columnDef {
  headerName!: string;
  field!: string;
  sortable?: boolean;
  filter?: boolean;
  editable?: boolean;
}



