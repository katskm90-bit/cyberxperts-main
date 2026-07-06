import type { Metadata } from "next";
import ProductsClient from "./ProductsClient";

export const metadata: Metadata = {
  title: "Products | Cyberxperts",
  description:
    "Security and IT products Cyberxperts implements and supports, including Microsoft, Fortinet, AWS, Nessus, and other established partner solutions.",
};

export default function Page() {
  return <ProductsClient />;
}
