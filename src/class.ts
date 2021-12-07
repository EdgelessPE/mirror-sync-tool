interface Package {
  name: string;
  version: string;
  fullName: string;
  category: string;
  illegal: boolean;
}

enum Cmp {
  E,
  L,
  G,
}

export{
    Package,
    Cmp
}
