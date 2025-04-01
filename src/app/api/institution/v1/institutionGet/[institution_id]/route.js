import company_details from '@/app/models/company_details';
import { dbConnect } from '@/app/utils/dbConnect';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { institution_id } = await params;

  console.log('id:', institution_id);
  if (!mongoose.Types.ObjectId.isValid(institution_id)) {
    return NextResponse.json(
      { error: 'Invalid institution ID format' },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const institution = await company_details
      .findById(institution_id)
      .select('CD_Company_Num CD_Company_Name');

    if (!institution) {
      return NextResponse.json(
        { error: 'Institution not found' },
        { status: 404 }
      );
    }

    // console.log('Institution:', institution);
    return NextResponse.json(institution, { status: 200 });
  } catch (error) {
    console.error('Institution fetch error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
