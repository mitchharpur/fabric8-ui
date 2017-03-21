export type FieldClassification = "singleSelection" | "multipleSelection" | "singleInput";

export class FieldValueClassification {
  static SingleSelection: FieldClassification = "singleSelection";
  static MultipleSelection: FieldClassification = "multipleSelection";
  static SingleInput: FieldClassification = "singleInput";
}
