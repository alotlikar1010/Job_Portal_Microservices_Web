"use client";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import React, {useEffect, useRef , useState} from "react";
import { job_service , useAppData } from "@/context/AppContext";
import { Company, Job } from "@/type";
import axios from "axios";
import Loading from "@/components/loading";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Building2,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  FileText,
  Globe,
  Laptop,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CompanyPage = () => {
    const {id} = useParams();
    const tiken = Cookies.get("token");
    const { user, isAuth } = useAppData();
    const [loading, setLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [company, setCompany] = useState<Company | null>(null);


};

export default CompanyPage;